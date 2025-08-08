"use client";

import Image from "next/image";
import { type ChangeEvent, useRef } from "react";

// --- SVG Icon ---
const CloseIcon = ({ ...props }) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

// --- Props Interface ---
interface ImageUploaderProps {
  name: string;
  previews: string[];
  onPreviewsChange: (previews: string[]) => void;
  onFilesAdded: (newFiles: File[]) => void;
  onFileRemoved: (indexToRemove: number) => void;
  maxFiles?: number;
  error?: string;
}

export function ImageUploader({
  name,
  previews,
  onPreviewsChange,
  onFilesAdded,
  onFileRemoved,
  maxFiles = 3,
  error,
}: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      if (previews.length + newFiles.length > maxFiles) {
        alert(`You can only upload a maximum of ${maxFiles} pictures.`);
        if (inputRef.current) inputRef.current.value = "";
        return;
      }

      onFilesAdded(newFiles);

      const newPreviews = newFiles.map((file) => URL.createObjectURL(file));
      onPreviewsChange([...previews, ...newPreviews]);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const handleRemovePicture = (indexToRemove: number) => {
    const newPreviews = previews.filter((_, i) => i !== indexToRemove);
    onPreviewsChange(newPreviews);
    onFileRemoved(indexToRemove);
  };

  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-1">
        Product Picture* ({previews.length}/{maxFiles})
      </label>
      <div
        className={`mt-1 flex justify-center rounded-md border-2 border-dashed px-6 pt-5 pb-6 ${
          error ? "border-red-500" : "border-gray-300"
        }`}
      >
        <div className="space-y-1 text-center">
          <Image
            src="/images/upload-icon.png"
            alt="upload"
            width={70}
            height={45}
            quality={100}
            className="mx-auto"
          />
          <label
                htmlFor="logo"
                className="cursor-pointer font-medium text-[#1F2937] hover:text-blue-500"
              >
                Upload your file
                <p className="text-sm font-medium text-neutral-500">
                  File size: 4:3
                  <br />
                  Maximum size: 5MB
                </p>
              </label>
          <input
            ref={inputRef}
            id={name}
            name={name}
            type="file"
            className="sr-only"
            multiple
            onChange={handleFileChange}
            accept="image/*"
            disabled={previews.length >= maxFiles}
          />
        </div>
      </div>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
      <div className="mt-2 grid grid-cols-3 gap-2">
        {previews.map((preview, index) => (
          <div key={preview} className="relative aspect-square">
            <Image
              src={preview}
              alt={`preview ${index}`}
              layout="fill"
              className="object-cover rounded-lg"
            />
            <button
              type="button"
              onClick={() => handleRemovePicture(index)}
              className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-0.5"
            >
              <CloseIcon className="h-3 w-3" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
