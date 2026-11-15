const WebsiteSetting = require('../models/WebsiteSetting');
const { logActivity } = require('../middleware/activityLogger');

// Helper to get or initialize settings document
const getSettingsDoc = async () => {
  let settings = await WebsiteSetting.findOne({ key: 'main_settings' });
  if (!settings) {
    settings = await WebsiteSetting.create({ key: 'main_settings' });
  }
  return settings;
};

// @desc    Get public website settings
// @route   GET /api/settings
// @access  Public
const getPublicSettings = async (req, res, next) => {
  try {
    const settings = await getSettingsDoc();

    res.status(200).json({
      success: true,
      data: settings,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get admin website settings
// @route   GET /api/admin/settings
// @access  Private
const getAdminSettings = async (req, res, next) => {
  try {
    const settings = await getSettingsDoc();

    res.status(200).json({
      success: true,
      data: settings,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update website settings
// @route   PUT /api/admin/settings
// @access  Private
const updateSettings = async (req, res, next) => {
  try {
    let settings = await getSettingsDoc();

    const allowedFields = [
      'siteName',
      'tagline',
      'logoUrl',
      'heroHeading',
      'heroSubheading',
      'heroBadge',
      'heroBgImage',
      'announcementText',
      'announcementActive',
      'whatsappNumber',
      'whatsappCountryCode',
      'whatsappMessageTemplate',
      'instagramUrl',
      'instagramHandle',
      'facebookUrl',
      'youtubeUrl',
      'contactPhone',
      'contactEmail',
      'googleMapsUrl',
      'address',
      'workingHours',
      'aboutTitle',
      'aboutText',
      'termsText',
      'privacyText',
    ];

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        settings[field] = req.body[field];
      }
    });

    await settings.save();

    await logActivity(req, 'UPDATE_SETTINGS', 'Settings', 'Updated website settings and business information.');

    res.status(200).json({
      success: true,
      message: 'Website settings updated successfully.',
      data: settings,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getPublicSettings,
  getAdminSettings,
  updateSettings,
};
