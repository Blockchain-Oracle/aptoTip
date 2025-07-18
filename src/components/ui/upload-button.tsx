'use client';

import { useUploadThing } from '@/lib/uploadthing';
import { Button } from '@/components/ui/button';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { useState } from 'react';
import Image from 'next/image';

interface UploadButtonProps {
  endpoint: 'profileImage' | 'bannerImage' | 'portfolioImages';
  onUploadComplete: (url: string) => void;
  onUploadError: (error: string) => void;
  className?: string;
  children?: React.ReactNode;
  maxFiles?: number;
  acceptedTypes?: string[];
}

export function UploadButton({
  endpoint,
  onUploadComplete,
  onUploadError,
  className = '',
  children,
  maxFiles = 1,
  acceptedTypes = ['image/*']
}: UploadButtonProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedUrls, setUploadedUrls] = useState<string[]>([]);

  const { startUpload, isUploading: isUploadThingUploading } = useUploadThing(endpoint, {
    onClientUploadComplete: (res) => {
      setIsUploading(false);
      if (res && res.length > 0) {
        const urls = res.map((file) => file.url);
        setUploadedUrls(prev => [...prev, ...urls]);
        urls.forEach(url => onUploadComplete(url));
      }
    },
    onUploadError: (error) => {
      setIsUploading(false);
      onUploadError(error.message);
    },
  });

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    await startUpload(Array.from(files));
  };

  const removeImage = (url: string) => {
    setUploadedUrls(prev => prev.filter(u => u !== url));
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Upload Button */}
      <div className="flex items-center space-x-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => document.getElementById(`upload-${endpoint}`)?.click()}
          disabled={isUploading || isUploadThingUploading}
          className="flex items-center space-x-2"
        >
          {isUploading || isUploadThingUploading ? (
            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
          ) : (
            <Upload className="w-4 h-4" />
          )}
          <span>
            {isUploading || isUploadThingUploading ? 'Uploading...' : children || 'Upload Image'}
          </span>
        </Button>
        
        <input
          id={`upload-${endpoint}`}
          type="file"
          accept={acceptedTypes.join(',')}
          multiple={maxFiles > 1}
          onChange={handleUpload}
          className="hidden"
        />
      </div>

      {/* Preview Uploaded Images */}
      {uploadedUrls.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {uploadedUrls.map((url, index) => (
            <div key={index} className="relative group">
              <div className="aspect-square rounded-lg overflow-hidden border border-gray-200">
                <Image
                  src={url}
                  alt={`Uploaded image ${index + 1}`}
                  width={200}
                  height={200}
                  className="w-full h-full object-cover"
                />
              </div>
              <button
                type="button"
                onClick={() => removeImage(url)}
                className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Placeholder for empty state */}
      {uploadedUrls.length === 0 && endpoint === 'portfolioImages' && (
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
          <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 mb-2">No portfolio images uploaded</p>
          <p className="text-sm text-gray-500">Upload at least one image to showcase your work</p>
        </div>
      )}
    </div>
  );
} 