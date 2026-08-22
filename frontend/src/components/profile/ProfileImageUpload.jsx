import React, { useState, useRef } from 'react';
import { Button } from '../common/Button';
import { ImageWithFallback } from '../common/ImageWithFallback';
import { Upload, Trash2, Camera, AlertCircle, CheckCircle2 } from 'lucide-react';
import { clsx } from 'clsx';

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];

export const ProfileImageUpload = ({
  currentImage,
  onImageChange,
  className = ''
}) => {
  const fileInputRef = useRef(null);
  const [preview, setPreview] = useState(currentImage);
  const [error, setError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const handleTriggerPicker = () => {
    setError('');
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileSelected = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError('');

    // Format validation
    if (!ALLOWED_TYPES.includes(file.type.toLowerCase())) {
      setError('Please select a JPG, PNG, or WEBP image.');
      return;
    }

    // Size validation (5 MB)
    if (file.size > MAX_FILE_SIZE_BYTES) {
      setError('Image must be smaller than 5 MB.');
      return;
    }

    // Read and convert to base64 DataURL for safe client-side persistence
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result;
      if (result) {
        setPreview(result);
        onImageChange(result);
        setIsSuccess(true);
        setTimeout(() => setIsSuccess(false), 3000);
      }
    };
    reader.onerror = () => {
      setError('Failed to read selected image file.');
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    const defaultAvatar = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80';
    setPreview(defaultAvatar);
    onImageChange(defaultAvatar);
    setError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className={clsx('flex flex-col gap-4 text-left', className)}>
      <label className="text-xs font-mono uppercase font-bold text-zinc-600 dark:text-zinc-400 tracking-wider">
        PROFILE PHOTO
      </label>

      {/* Hidden native HTML5 file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleFileSelected}
        className="hidden"
        aria-label="Upload profile image"
      />

      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 p-5 rounded-3xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200/80 dark:border-zinc-700/80">
        {/* Avatar Preview */}
        <div className="relative w-24 h-24 rounded-3xl overflow-hidden border-2 border-zinc-300 dark:border-zinc-700 shadow-md shrink-0 bg-white dark:bg-zinc-900 group">
          <ImageWithFallback
            src={preview}
            alt="Profile Preview"
            fallbackCategory="Traveler"
            className="w-full h-full object-cover"
          />

          <div
            onClick={handleTriggerPicker}
            className="absolute inset-0 bg-zinc-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white cursor-pointer"
          >
            <Camera className="w-5 h-5 mb-1" />
            <span className="text-[9px] font-bold uppercase">Change</span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex-1 flex flex-col justify-between space-y-2 text-center sm:text-left">
          <div>
            <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
              Upload from your Computer
            </h4>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
              JPG, PNG or WEBP up to 5 MB.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5 pt-1">
            <Button
              type="button"
              variant="primary"
              size="sm"
              icon={Upload}
              onClick={handleTriggerPicker}
              className="text-xs font-bold"
            >
              Change Photo
            </Button>

            {preview && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                icon={Trash2}
                onClick={handleRemoveImage}
                className="text-xs font-bold text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/30"
              >
                Remove
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Error / Validation Notification */}
      {error && (
        <div className="flex items-center gap-2 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs font-bold animate-in fade-in">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Success Notification */}
      {isSuccess && (
        <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs font-bold animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
          <span>New photo selected and ready to save.</span>
        </div>
      )}
    </div>
  );
};
