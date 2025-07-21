'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';

const CloseIcon = ({ ...props }) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

// 1. กำหนด Props interface
interface ImagePickerProps {
  error?: string;
  initialPreview?: string | null;
}

export function ImagePicker({ error, initialPreview = null }: ImagePickerProps) {
  // 2. ใช้ initialPreview เป็นค่าเริ่มต้นของ State
  const [preview, setPreview] = useState<string | null>(initialPreview);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setPreview(null);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Farm Logo*</label>
      <div
        className={`relative w-full overflow-hidden rounded-lg border-2 border-dashed ${error ? 'border-red-500' : 'border-gray-300'}`}
        style={{ aspectRatio: '1 / 1' }}
      >
        {preview ? (
          <>
            <Image src={preview} alt="Logo preview" layout="fill" className="object-cover" />
            <button
              onClick={handleRemoveImage}
              className="absolute top-2 right-2 z-10 rounded-full bg-gray-800 bg-opacity-50 p-1.5 text-white hover:bg-opacity-75"
              aria-label="Remove image"
            >
              <CloseIcon />
            </button>
          </>
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gray-50 dark:bg-neutral-900">
            <div className="text-center">
              <label htmlFor="logo" className="cursor-pointer font-medium text-blue-600 hover:text-blue-500">
                Upload your file
                <p className="text-xs text-gray-500">PNG, JPG, WEBP up to 5MB</p>
              </label>
            </div>
          </div>
        )}
        
        <input
          ref={inputRef}
          id="logo"
          name="logo"
          type="file"
          className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
          onChange={handleFileChange}
          accept="image/*"
        />
      </div>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
}