import React, { useState, useRef } from 'react';
import Cropper from 'react-easy-crop';
import {
  Upload,
  Image as ImageIcon,
  Crop,
  Check,
  X,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Loader2,
  Trash2,
  Link as LinkIcon,
} from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../services/api';
import { getCroppedImg } from '../../utils/cropImage';

const ImageUploadCropper = ({
  label = 'Image',
  value = '',
  onChange,
  aspect = 3 / 4,
  tag = 'game-cover',
  helperText = '',
  required = false,
}) => {
  const [tempImage, setTempImage] = useState(null);
  const [isCropping, setIsCropping] = useState(false);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);

  const fileInputRef = useRef(null);

  const onCropComplete = (croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please select a valid image file (PNG, JPG, WEBP).');
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    setTempImage(objectUrl);
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setIsCropping(true);
    e.target.value = '';
  };

  const handleCropAndUpload = async () => {
    if (!tempImage || !croppedAreaPixels) return;

    try {
      setUploading(true);
      const croppedBlob = await getCroppedImg(tempImage, croppedAreaPixels);

      const formData = new FormData();
      formData.append('image', croppedBlob, `upload-${Date.now()}.jpg`);
      formData.append('tag', tag);

      const res = await api.post('/admin/media/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (res.data.success) {
        const uploadedUrl = res.data.data?.url || res.data.url;
        onChange(uploadedUrl);
        toast.success(`${label} cropped and uploaded successfully!`);
        setIsCropping(false);
        if (tempImage) URL.revokeObjectURL(tempImage);
        setTempImage(null);
      } else {
        toast.error(res.data.message || 'Failed to upload image.');
      }
    } catch (err) {
      console.error('Crop & Upload failed:', err);
      toast.error(err.response?.data?.message || 'Error processing image.');
    } finally {
      setUploading(false);
    }
  };

  const handleCancelCrop = () => {
    if (tempImage) URL.revokeObjectURL(tempImage);
    setTempImage(null);
    setIsCropping(false);
  };

  const handleRemoveImage = () => {
    onChange('');
    toast.success(`${label} removed.`);
  };

  return (
    <div className="space-y-1.5 text-xs">
      <div className="flex items-center justify-between">
        <label className="block font-semibold text-zinc-300">
          {label} {required && <span className="text-purple-400">*</span>}
        </label>
        <button
          type="button"
          onClick={() => setShowUrlInput(!showUrlInput)}
          className="text-[11px] text-purple-400 hover:text-purple-300 flex items-center gap-1 transition-colors"
        >
          <LinkIcon className="w-3 h-3" />
          <span>{showUrlInput ? 'Hide URL input' : 'Paste URL instead'}</span>
        </button>
      </div>

      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        accept="image/*"
        className="hidden"
      />

      {/* URL input toggle */}
      {showUrlInput && (
        <div className="mb-2">
          <input
            type="url"
            placeholder="https://res.cloudinary.com/..."
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full px-3 py-1.5 sm:py-2 rounded-xl bg-vault-surface border border-zinc-800 focus:border-purple-400 text-white outline-none"
          />
        </div>
      )}

      {/* Image preview or upload box */}
      {value ? (
        <div className="relative group p-2.5 rounded-2xl bg-vault-surface border border-purple-500/25 flex items-center gap-3">
          <div className="relative w-16 h-20 rounded-xl overflow-hidden bg-zinc-900 border border-zinc-800 shrink-0">
            <img
              src={value}
              alt={label}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src = '/logo.jpeg';
              }}
            />
          </div>

          <div className="min-w-0 flex-1">
            <p className="font-semibold text-white text-xs truncate max-w-[200px] sm:max-w-xs">
              {value}
            </p>
            <p className="text-[10px] text-emerald-400 flex items-center gap-1 mt-0.5">
              <Check className="w-3 h-3" /> Ready to save
            </p>

            <div className="flex items-center gap-2 mt-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-2.5 py-1 rounded-lg bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/30 text-purple-300 text-[10px] font-semibold flex items-center gap-1 transition-colors"
              >
                <Crop className="w-3 h-3" />
                <span>Replace from PC</span>
              </button>

              <button
                type="button"
                onClick={handleRemoveImage}
                className="p-1 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-400 transition-colors"
                title="Remove image"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-zinc-700 hover:border-purple-500/60 rounded-2xl p-4 sm:p-5 text-center cursor-pointer bg-vault-surface/50 hover:bg-purple-950/20 transition-all group"
        >
          <div className="w-10 h-10 mx-auto rounded-xl bg-purple-950/60 border border-purple-500/30 text-purple-400 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
            <Upload className="w-5 h-5" />
          </div>
          <p className="font-semibold text-white text-xs">
            Upload & Crop from PC
          </p>
          <p className="text-[10px] text-zinc-400 mt-0.5">
            PNG, JPG, WEBP (Interactive crop preview)
          </p>
          {helperText && (
            <p className="text-[10px] text-purple-300/70 mt-1">{helperText}</p>
          )}
        </div>
      )}

      {/* Interactive Crop Modal */}
      {isCropping && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 bg-black/90 backdrop-blur-md">
          <div
            className="w-full max-w-xl bg-vault-card border border-purple-500/40 rounded-3xl p-4 sm:p-6 shadow-2xl space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-purple-500/20">
              <div className="flex items-center gap-2 text-white">
                <Crop className="w-4 h-4 text-purple-400" />
                <h3 className="font-gaming font-bold text-base sm:text-lg">
                  Crop & Adjust {label}
                </h3>
              </div>
              <button
                type="button"
                onClick={handleCancelCrop}
                disabled={uploading}
                className="p-1 rounded-lg text-zinc-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Cropper area container */}
            <div className="relative w-full h-72 sm:h-80 bg-zinc-950 rounded-2xl overflow-hidden border border-zinc-800">
              <Cropper
                image={tempImage}
                crop={crop}
                zoom={zoom}
                aspect={aspect}
                onCropChange={setCrop}
                onCropComplete={onCropComplete}
                onZoomChange={setZoom}
              />
            </div>

            {/* Zoom Slider */}
            <div className="flex items-center gap-3 px-2 text-zinc-300">
              <ZoomOut className="w-4 h-4 text-zinc-400 shrink-0" />
              <input
                type="range"
                value={zoom}
                min={1}
                max={3}
                step={0.05}
                aria-labelledby="Zoom"
                onChange={(e) => setZoom(Number(e.target.value))}
                className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-purple-500"
              />
              <ZoomIn className="w-4 h-4 text-zinc-400 shrink-0" />
              <span className="text-[11px] font-mono text-purple-300 min-w-[32px] text-right">
                {zoom.toFixed(1)}x
              </span>
            </div>

            {/* Modal action buttons */}
            <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-purple-500/20">
              <button
                type="button"
                onClick={handleCancelCrop}
                disabled={uploading}
                className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-semibold text-xs transition-colors"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleCropAndUpload}
                disabled={uploading}
                className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs flex items-center gap-2 shadow-glow-sm transition-all disabled:opacity-50"
              >
                {uploading ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Uploading...</span>
                  </>
                ) : (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Crop & Upload</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUploadCropper;
