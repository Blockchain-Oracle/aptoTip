'use client';

import { useUploadThing } from '@/lib/uploadthing';
import { Button } from '@/components/ui/button';
import { Upload } from 'lucide-react';
import { useState } from 'react';

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

  const { startUpload, isUploading: isUploadThingUploading } = useUploadThing(endpoint, {
    onClientUploadComplete: (res) => {
      setIsUploading(false);
      if (res && res.length > 0) {
        const urls = res.map((file) => file.url);
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

  return (
    <div className={className}>
      <Button
        type="button"
        variant="outline"
        onClick={() => document.getElementById(`upload-${endpoint}`)?.click()}
        disabled={isUploading || isUploadThingUploading}
        className="w-full flex items-center justify-center space-x-2"
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
  );
} 