import React, { useState, useEffect, useRef } from 'react';
import {
  Image as ImageIcon,
  Upload,
  Copy,
  Check,
  Trash2,
  Filter,
  Sparkles,
  Cloud,
  CheckCircle2,
  AlertCircle,
  Crop,
} from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../services/api';
import ImageCropModal from '../../components/admin/ImageCropModal';
import DeleteConfirmModal from '../../components/admin/DeleteConfirmModal';

const MediaLibrary = () => {
  const [mediaList, setMediaList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [filterTag, setFilterTag] = useState('all');
  const [uploadTag, setUploadTag] = useState('game-cover');
  const [copiedId, setCopiedId] = useState(null);
  const [statusMessage, setStatusMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Delete modal states
  const [deleteItem, setDeleteItem] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Stretchable crop modal states
  const [tempImage, setTempImage] = useState(null);
  const [isCropping, setIsCropping] = useState(false);
  const fileInputRef = useRef(null);

  const fetchMedia = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/media', {
        params: { tag: filterTag !== 'all' ? filterTag : undefined },
      });
      if (res.data.success) {
        setMediaList(res.data.data || []);
      }
    } catch (err) {
      console.error('Failed to load media:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedia();
  }, [filterTag]);

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please select a valid image file (PNG, JPG, WEBP).');
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    setTempImage(objectUrl);
    setIsCropping(true);
    e.target.value = '';
  };

  const handleCropConfirm = async (croppedBlob) => {
    const formData = new FormData();
    formData.append('image', croppedBlob, `media-${Date.now()}.jpg`);
    formData.append('tag', uploadTag);

    try {
      setUploading(true);
      setErrorMessage('');
      const res = await api.post('/admin/media/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (res.data.success) {
        toast.success('Image cropped & uploaded to Cloudinary successfully!');
        setStatusMessage('Image uploaded to Cloudinary successfully!');
        setTimeout(() => setStatusMessage(''), 3000);
        setIsCropping(false);
        if (tempImage) URL.revokeObjectURL(tempImage);
        setTempImage(null);
        fetchMedia();
      } else {
        toast.error(res.data.message || 'Upload failed.');
      }
    } catch (err) {
      const errText = err.response?.data?.message || 'Upload to Cloudinary failed.';
      toast.error(errText);
      setErrorMessage(errText);
    } finally {
      setUploading(false);
    }
  };

  const handleCancelCrop = () => {
    if (tempImage) URL.revokeObjectURL(tempImage);
    setTempImage(null);
    setIsCropping(false);
  };

  const handleCopyUrl = (url, id) => {
    const fullUrl = url.startsWith('http') ? url : `${window.location.origin}${url}`;
    navigator.clipboard.writeText(fullUrl);
    setCopiedId(id);
    toast.success('Image URL copied to clipboard!');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDeleteClick = (item) => {
    setDeleteItem(item);
  };

  const handleConfirmDelete = async () => {
    if (!deleteItem) return;
    try {
      setDeleting(true);
      await api.delete(`/admin/media/${deleteItem._id}`);
      toast.success('Media asset permanently deleted.');
      setDeleteItem(null);
      fetchMedia();
    } catch (err) {
      console.error('Delete failed:', err);
      toast.error(err.response?.data?.message || 'Failed to delete media asset.');
    } finally {
      setDeleting(false);
    }
  };

  const getInitialAspect = () => {
    if (uploadTag === 'game-cover') return 3 / 4;
    if (uploadTag === 'banner') return 16 / 9;
    if (uploadTag === 'logo') return 1;
    return undefined; // Freeform stretch for general
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-gaming font-extrabold text-2xl text-white tracking-wide">
              Media & Artwork Library
            </h2>
            <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-[10px] font-bold flex items-center gap-1">
              <Cloud className="w-3 h-3" />
              <span>Cloudinary CDN</span>
            </span>
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            Upload game covers, promotional banners, and PlayStation artwork with stretchable crop. Copy URLs to use in game forms.
          </p>
        </div>

        {/* Upload Trigger Area */}
        <div className="flex items-center gap-3">
          <select
            value={uploadTag}
            onChange={(e) => setUploadTag(e.target.value)}
            className="px-3 py-2 rounded-xl bg-vault-card border border-zinc-800 text-white text-xs outline-none"
          >
            <option value="game-cover">Game Cover Art (3:4)</option>
            <option value="banner">Promotional Banner (16:9)</option>
            <option value="logo">Logo & Badges (1:1)</option>
            <option value="general">General Asset (Freeform)</option>
          </select>

          <label className="cursor-pointer px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs flex items-center gap-2 shadow-glow-sm transition-all">
            <Upload className="w-4 h-4" />
            <span>{uploading ? 'Processing...' : 'Upload & Crop Image'}</span>
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              disabled={uploading}
              onChange={handleFileSelect}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {statusMessage && (
        <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{statusMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="p-3.5 rounded-xl bg-rose-950/40 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 text-xs">
        {['all', 'game-cover', 'banner', 'logo', 'general'].map((tag) => (
          <button
            key={tag}
            onClick={() => setFilterTag(tag)}
            className={`px-3 py-1.5 rounded-lg font-semibold uppercase tracking-wider transition-all ${
              filterTag === tag
                ? 'bg-purple-600 text-white'
                : 'bg-vault-card text-zinc-400 hover:text-white border border-zinc-800'
            }`}
          >
            {tag}
          </button>
        ))}
      </div>

      {/* Media Grid */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="h-56 rounded-2xl bg-vault-card/60 animate-pulse border border-zinc-800" />
          ))}
        </div>
      ) : mediaList.length === 0 ? (
        <div className="p-16 text-center bg-vault-card rounded-2xl border border-purple-500/15">
          <ImageIcon className="w-12 h-12 text-zinc-600 mx-auto mb-3" />
          <h3 className="font-bold text-white text-base">No media assets found</h3>
          <p className="text-xs text-zinc-400 mt-1">Upload your first game poster or banner image above.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {mediaList.map((item) => (
            <div
              key={item._id}
              className="group rounded-2xl bg-vault-card border border-purple-500/15 hover:border-purple-400/50 p-3 flex flex-col justify-between transition-all"
            >
              <div className="relative h-44 rounded-xl overflow-hidden bg-vault-surface border border-zinc-800">
                <img
                  src={item.url}
                  alt={item.title || item.fileName}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
                <span className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/70 backdrop-blur-sm text-[10px] font-bold text-purple-300 uppercase">
                  {item.tag}
                </span>
              </div>

              <div className="mt-3">
                <div className="text-xs font-semibold text-white truncate" title={item.fileName}>
                  {item.title || item.fileName}
                </div>
                <div className="text-[10px] text-zinc-400 mt-0.5">
                  {item.size ? `${Math.round(item.size / 1024)} KB` : 'Cloudinary'}
                </div>
              </div>

              <div className="mt-3 pt-2.5 border-t border-purple-500/10 flex items-center justify-between gap-2">
                <button
                  onClick={() => handleCopyUrl(item.url, item._id)}
                  className="flex-1 py-1.5 px-2 rounded-lg bg-vault-surface hover:bg-purple-900/40 text-purple-300 hover:text-white border border-purple-500/20 text-[11px] font-semibold flex items-center justify-center gap-1.5 transition-colors"
                >
                  {copiedId === item._id ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy URL</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => handleDeleteClick(item)}
                  className="p-1.5 rounded-lg bg-vault-surface hover:bg-rose-950/40 border border-zinc-800 hover:border-rose-500/40 text-zinc-400 hover:text-rose-400 transition-colors"
                  title="Delete Image"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Stretchable Crop Modal for Media Library */}
      {isCropping && tempImage && (
        <ImageCropModal
          imageSrc={tempImage}
          initialAspect={getInitialAspect()}
          title={`Crop Media Asset (${uploadTag})`}
          onConfirm={handleCropConfirm}
          onCancel={handleCancelCrop}
          isUploading={uploading}
        />
      )}

      {/* Custom Gaming Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={!!deleteItem}
        onClose={() => setDeleteItem(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Media Asset?"
        itemName={deleteItem?.title || deleteItem?.fileName || 'Image Asset'}
        description="Are you sure you want to delete this media asset? It will be permanently removed from Cloudinary CDN and will no longer load in forms."
        loading={deleting}
      />
    </div>
  );
};

export default MediaLibrary;
