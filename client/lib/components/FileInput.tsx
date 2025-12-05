'use client';

import React, { useState, useRef } from 'react';

interface FileInputProps {
  label: string;
  error?: string;
  accept?: string;
  onChange?: (file: File | null) => void;
  maxSize?: number; // in MB
  name?: string;
  id?: string;
  showPreview?: boolean; // For image files
}

export function FileInput({
  label,
  error,
  accept = 'image/*',
  onChange,
  maxSize = 5,
  name = 'file',
  id,
  showPreview = false,
}: FileInputProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string>('');
  const [preview, setPreview] = useState<string>('');
  const inputRef = useRef<HTMLInputElement>(null);
  const inputId = id || name;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setFileError('');

    if (!file) {
      setSelectedFile(null);
      setPreview('');
      onChange?.(null);
      return;
    }

    // Validate file size
    const maxSizeBytes = maxSize * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      setFileError(`File too large. Maximum size is ${maxSize}MB`);
      setSelectedFile(null);
      setPreview('');
      onChange?.(null);
      if (inputRef.current) {
        inputRef.current.value = '';
      }
      return;
    }

    setSelectedFile(file);
    onChange?.(file);

    // Create preview for images
    if (showPreview && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div>
      <label
        htmlFor={inputId}
        className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2"
      >
        {label}
      </label>
      <input
        ref={inputRef}
        id={inputId}
        type="file"
        name={name}
        accept={accept}
        onChange={handleFileChange}
        className={`block w-full text-sm text-zinc-700 dark:text-zinc-300 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 dark:file:bg-blue-900/30 dark:file:text-blue-400 ${
          error || fileError ? 'border-red-500 dark:border-red-500' : ''
        }`}
      />
      {selectedFile && !fileError && (
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          Selected: {selectedFile.name}
        </p>
      )}
      {showPreview && preview && (
        <div className="mt-2">
          <img
            src={preview}
            alt="Preview"
            className="max-w-xs max-h-48 rounded-lg border border-zinc-300 dark:border-zinc-700"
          />
        </div>
      )}
      {(error || fileError) && (
        <p className="mt-1 text-sm text-red-600 dark:text-red-400">
          {error || fileError}
        </p>
      )}
    </div>
  );
}

