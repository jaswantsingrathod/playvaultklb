import React, { useState, useRef } from 'react';
import ReactCrop, { centerCrop, makeAspectCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import {
  Crop,
  Check,
  X,
  Maximize2,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Loader2,
  Sliders,
  Move,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { getCanvasCroppedBlob } from '../../utils/cropImage';

const ASPECT_PRESETS = [
  { label: 'Freeform (Stretch Any Size)', value: undefined, description: 'Drag any handle freely' },
  { label: '3:4 (Game Cover Poster)', value: 3 / 4, description: 'Standard PS5 Cover' },
  { label: '16:9 (Landscape Banner)', value: 16 / 9, description: 'Wide Banner' },
  { label: '1:1 (Square)', value: 1, description: 'Square Badge' },
];

const ImageCropModal = ({
  imageSrc,
  initialAspect = 3 / 4,
  title = 'Crop & Resize Image',
  onConfirm,
  onCancel,
  isUploading = false,
}) => {
  const [selectedAspect, setSelectedAspect] = useState(initialAspect);
  const [crop, setCrop] = useState();
  const [completedCrop, setCompletedCrop] = useState(null);
  const [zoom, setZoom] = useState(1);
  const [processing, setProcessing] = useState(false);

  const imgRef = useRef(null);

  const onImageLoad = (e) => {
    const { width, height } = e.currentTarget;
    if (selectedAspect) {
      const initialCrop = centerCrop(
        makeAspectCrop(
          {
            unit: '%',
            width: 80,
          },
          selectedAspect,
          width,
          height
        ),
        width,
        height
      );
      setCrop(initialCrop);
      setCompletedCrop(initialCrop);
    } else {
      const initialCrop = {
        unit: '%',
        x: 10,
        y: 10,
        width: 80,
        height: 80,
      };
      setCrop(initialCrop);
      setCompletedCrop(initialCrop);
    }
  };

  const handleAspectChange = (newAspect) => {
    setSelectedAspect(newAspect);
    if (imgRef.current) {
      const { width, height } = imgRef.current;
      if (newAspect) {
        const newCrop = centerCrop(
          makeAspectCrop(
            {
              unit: '%',
              width: 80,
            },
            newAspect,
            width,
            height
          ),
          width,
          height
        );
        setCrop(newCrop);
        setCompletedCrop(newCrop);
      } else {
        // Freeform: keep current dimensions or set percent
        setCrop((prev) => (prev ? { ...prev, unit: '%' } : { unit: '%', x: 10, y: 10, width: 80, height: 80 }));
      }
    }
  };

  const handleApplyCrop = async () => {
    if (!imgRef.current || !completedCrop) {
      toast.error('Please adjust and select a crop area on the image.');
      return;
    }

    try {
      setProcessing(true);
      const blob = await getCanvasCroppedBlob(imgRef.current, completedCrop);
      await onConfirm(blob);
    } catch (err) {
      console.error('Crop confirmation failed:', err);
      toast.error(err.message || 'Error processing crop area.');
    } finally {
      setProcessing(false);
    }
  };

  const cropWidth = completedCrop ? Math.round(completedCrop.width) : 0;
  const cropHeight = completedCrop ? Math.round(completedCrop.height) : 0;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="w-full max-w-2xl bg-vault-card border border-purple-500/30 rounded-3xl p-4 sm:p-6 shadow-2xl flex flex-col max-h-[92vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-purple-500/15 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <Crop className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-gaming font-bold text-base sm:text-lg text-white tracking-wide">
                {title}
              </h3>
              <p className="text-[11px] text-zinc-400">
                Drag corner & edge handles to stretch the crop box to any size
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onCancel}
            disabled={processing || isUploading}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-vault-surface transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Aspect Ratio Mode Toolbar */}
        <div className="py-3 flex items-center justify-between gap-2 overflow-x-auto shrink-0 border-b border-purple-500/10">
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1 mr-1">
              <Move className="w-3 h-3 text-purple-400" />
              <span>Stretch:</span>
            </span>

            {ASPECT_PRESETS.map((preset) => {
              const isActive = selectedAspect === preset.value;
              return (
                <button
                  key={preset.label}
                  type="button"
                  onClick={() => handleAspectChange(preset.value)}
                  className={`px-2.5 py-1.5 rounded-xl text-[11px] font-semibold whitespace-nowrap transition-all ${
                    isActive
                      ? 'bg-purple-600 text-white shadow-glow-sm border border-purple-400'
                      : 'bg-vault-surface text-zinc-300 hover:text-white hover:bg-vault-card border border-zinc-800'
                  }`}
                  title={preset.description}
                >
                  {preset.label}
                </button>
              );
            })}
          </div>

          {cropWidth > 0 && cropHeight > 0 && (
            <span className="hidden sm:inline-block text-[10px] font-mono text-purple-300 bg-purple-950/40 px-2 py-1 rounded-lg border border-purple-500/25 shrink-0">
              {cropWidth} × {cropHeight} px
            </span>
          )}
        </div>

        {/* Crop Viewport */}
        <div className="flex-1 min-h-[260px] max-h-[50vh] sm:max-h-[55vh] overflow-auto bg-zinc-950/90 rounded-2xl p-2 sm:p-4 flex items-center justify-center my-3 border border-zinc-800/80 relative">
          <ReactCrop
            crop={crop}
            onChange={(_, percentCrop) => setCrop(percentCrop)}
            onComplete={(c) => setCompletedCrop(c)}
            aspect={selectedAspect}
            className="max-h-full"
          >
            <img
              ref={imgRef}
              src={imageSrc}
              alt="Source crop target"
              onLoad={onImageLoad}
              style={{
                transform: `scale(${zoom})`,
                maxHeight: '48vh',
                maxWidth: '100%',
                objectFit: 'contain',
                transition: 'transform 0.1s ease-out',
              }}
              crossOrigin="anonymous"
            />
          </ReactCrop>
        </div>

        {/* Zoom Slider & Hint */}
        <div className="flex items-center justify-between gap-3 px-2 py-1.5 text-zinc-300 text-xs shrink-0">
          <div className="flex items-center gap-2 flex-1 max-w-xs">
            <ZoomOut className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
            <input
              type="range"
              value={zoom}
              min={0.8}
              max={2.5}
              step={0.05}
              onChange={(e) => setZoom(Number(e.target.value))}
              className="w-full h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-purple-500"
            />
            <ZoomIn className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
            <span className="text-[10px] font-mono text-zinc-400 w-8">{Math.round(zoom * 100)}%</span>
          </div>

          <p className="text-[10px] text-zinc-400 text-right">
            💡 Pull any handle to stretch freely
          </p>
        </div>

        {/* Actions Footer */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-purple-500/15 shrink-0">
          <button
            type="button"
            onClick={onCancel}
            disabled={processing || isUploading}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-zinc-300 hover:text-white bg-vault-surface hover:bg-vault-card border border-zinc-800 transition-colors"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleApplyCrop}
            disabled={processing || isUploading}
            className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 shadow-glow-sm flex items-center gap-2 transition-all disabled:opacity-50"
          >
            {processing || isUploading ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Uploading...</span>
              </>
            ) : (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Confirm & Upload</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImageCropModal;
