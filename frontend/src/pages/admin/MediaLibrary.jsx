import React, { useState, useEffect } from 'react';
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
} from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../services/api';

const MediaLibrary = () => {
  const [mediaList, setMediaList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [filterTag, setFilterTag] = useState('all');
  const [uploadTag, setUploadTag] = useState('game-cover');
  const [copiedId, setCopiedId] = useState(null);
  const [statusMessage, setStatusMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

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

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);
    formData.append('tag', uploadTag);

    try {
      setUploading(true);
      setErrorMessage('');
      const res = await api.post('/admin/media/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (res.data.success) {
        toast.success('Image uploaded to Cloudinary successfully!');
        setStatusMessage('Image uploaded to Cloudinary successfully!');
        setTimeout(() => setStatusMessage(''), 3000);
        fetchMedia();
      }
    } catch (err) {
      const errText = err.response?.data?.message || 'Upload to Cloudinary failed.';
      toast.error(errText);
      setErrorMessage(errText);
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const handleCopyUrl = (url, id) => {
    // If relative path, prepend host, otherwise copy full cloudinary URL
    const fullUrl = url.startsWith('http') ? url : `${window.location.origin}${url}`;
    navigator.clipboard.writeText(fullUrl);
    setCopiedId(id);
    toast.success('Image URL copied to clipboard!');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this media asset?')) return;
    try {
      await api.delete(`/admin/media/${id}`);
      toast.success('Media deleted successfully.');
      fetchMedia();
    } catch (err) {
      console.error('Delete failed:', err);
      toast.error(err.response?.data?.message || 'Failed to delete media asset.');
    }
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
            Upload game covers, promotional banners, and PlayStation artwork. Copy URLs to use in game forms.
          </p>
        </div>

        {/* Upload Trigger Area */}
        <div className="flex items-center gap-3">
          <select
            value={uploadTag}
            onChange={(e) => setUploadTag(e.target.value)}
            className="px-3 py-2 rounded-xl bg-vault-card border border-zinc-800 text-white text-xs outline-none"
          >
            <option value="game-cover">Game Cover Art</option>
            <option value="banner">Promotional Banner</option>
            <option value="logo">Logo & Badges</option>
            <option value="general">General Asset</option>
          </select>

          <label className="cursor-pointer px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs flex items-center gap-2 shadow-glow-sm transition-all">
            <Upload className="w-4 h-4" />
            <span>{uploading ? 'Uploading to Cloudinary...' : 'Upload Image'}</span>
            <input
              type="file"
              accept="image/*"
              disabled={uploading}
              onChange={handleFileUpload}
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
                  onClick={() => handleDelete(item._id)}
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
    </div>
  );
};

export default MediaLibrary;
