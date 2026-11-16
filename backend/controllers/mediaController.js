const path = require('path');
const fs = require('fs');
const cloudinary = require('cloudinary').v2;
const Media = require('../models/Media');
const { logActivity } = require('../middleware/activityLogger');

// Configure Cloudinary
if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
  console.log(`[Cloudinary] Configured successfully for cloud: ${process.env.CLOUDINARY_CLOUD_NAME}`);
}

// @desc    Upload media file (Cloudinary with local fallback)
// @route   POST /api/admin/media/upload
// @access  Private
const uploadMedia = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded. Please select an image.',
      });
    }

    const { tag = 'general', title = '' } = req.body;
    let fileUrl = `/uploads/${req.file.filename}`;
    let publicId = '';

    // Check if Cloudinary is configured
    if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY) {
      try {
        console.log(`[Cloudinary] Uploading ${req.file.filename} to Cloudinary...`);
        const uploadResult = await cloudinary.uploader.upload(req.file.path, {
          folder: 'playvault',
          use_filename: true,
          unique_filename: true,
          resource_type: 'image',
        });

        fileUrl = uploadResult.secure_url;
        publicId = uploadResult.public_id;
        console.log(`[Cloudinary] Upload succeeded: ${fileUrl}`);

        // Cleanup local temporary file after successful Cloudinary upload
        if (fs.existsSync(req.file.path)) {
          fs.unlinkSync(req.file.path);
        }
      } catch (cloudErr) {
        console.error('[Cloudinary Upload Error]', cloudErr.message);
        // Retain local file as fallback
      }
    }

    const media = await Media.create({
      title: title || req.file.originalname,
      fileName: req.file.filename,
      url: fileUrl,
      publicId: publicId,
      mimeType: req.file.mimetype,
      size: req.file.size,
      tag,
      uploadedBy: req.admin ? req.admin._id : null,
    });

    await logActivity(
      req,
      'UPLOAD_MEDIA',
      'Media',
      `Uploaded image to ${publicId ? 'Cloudinary' : 'local storage'}: ${media.fileName} (${media.tag})`
    );

    res.status(201).json({
      success: true,
      message: 'Image uploaded successfully to Cloudinary.',
      url: media.url,
      data: media,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all media files
// @route   GET /api/admin/media
// @access  Private
const getAllMedia = async (req, res, next) => {
  try {
    const { page = 1, limit = 50, tag } = req.query;

    const query = {};
    if (tag && tag !== 'all') query.tag = tag;

    const skip = (Number(page) - 1) * Number(limit);
    const total = await Media.countDocuments(query);

    const mediaItems = await Media.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit))
      .populate('uploadedBy', 'username fullName');

    res.status(200).json({
      success: true,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
      count: mediaItems.length,
      data: mediaItems,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete media file
// @route   DELETE /api/admin/media/:id
// @access  Private
const deleteMedia = async (req, res, next) => {
  try {
    const { id } = req.params;
    const media = await Media.findById(id);

    if (!media) {
      return res.status(404).json({
        success: false,
        message: 'Media not found.',
      });
    }

    // If Cloudinary asset, delete from Cloudinary
    if (media.publicId) {
      try {
        await cloudinary.uploader.destroy(media.publicId);
        console.log(`[Cloudinary] Deleted asset: ${media.publicId}`);
      } catch (cloudDelErr) {
        console.warn('[Cloudinary Delete Error]', cloudDelErr.message);
      }
    }

    // Try to remove local file if exists
    if (media.fileName) {
      const filePath = path.join(__dirname, '../uploads', media.fileName);
      if (fs.existsSync(filePath)) {
        try {
          fs.unlinkSync(filePath);
        } catch (unlinkErr) {
          console.warn('[Media Delete] Could not unlink local file:', unlinkErr.message);
        }
      }
    }

    await Media.findByIdAndDelete(id);

    await logActivity(req, 'DELETE_MEDIA', 'Media', `Deleted image: ${media.fileName}`);

    res.status(200).json({
      success: true,
      message: 'Media deleted successfully.',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Bulk delete media files
// @route   POST /api/admin/media/bulk-delete
// @access  Private
const bulkDeleteMedia = async (req, res, next) => {
  try {
    const { ids } = req.body;

    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide an array of media IDs to delete.',
      });
    }

    const items = await Media.find({ _id: { $in: ids } });

    for (const media of items) {
      if (media.publicId) {
        try {
          await cloudinary.uploader.destroy(media.publicId);
        } catch (e) {
          console.warn('[Cloudinary Bulk Delete]', e.message);
        }
      }
      if (media.fileName) {
        const filePath = path.join(__dirname, '../uploads', media.fileName);
        if (fs.existsSync(filePath)) {
          try {
            fs.unlinkSync(filePath);
          } catch (e) {}
        }
      }
    }

    const deleteResult = await Media.deleteMany({ _id: { $in: ids } });

    await logActivity(
      req,
      'BULK_DELETE_MEDIA',
      'Media',
      `Bulk deleted ${deleteResult.deletedCount || ids.length} media files.`
    );

    res.status(200).json({
      success: true,
      message: `Successfully deleted ${deleteResult.deletedCount || ids.length} media files.`,
      deletedCount: deleteResult.deletedCount,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  uploadMedia,
  getAllMedia,
  deleteMedia,
  bulkDeleteMedia,
};
