import React, { useRef, useState } from 'react';
import { Upload, X, Loader2 } from 'lucide-react';
import { useImageUpload } from '@/hooks/use-image-upload';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

interface ImageUploaderProps {
  onUploadComplete?: (url: string) => void;
  type?: 'machine' | 'banner' | 'category' | 'avatar';
  id?: string;
  maxSizeMB?: number;
  acceptedFormats?: string[];
}

export function ImageUploader({
  onUploadComplete,
  type = 'banner',
  id,
  maxSizeMB = 5,
  acceptedFormats = ['.jpg', '.jpeg', '.png', '.webp']
}: ImageUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const { uploadImage, isUploading, uploadProgress, imageUrl, error, resetUpload } = useImageUpload();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file size
      const fileSizeMB = file.size / 1024 / 1024;
      if (fileSizeMB > maxSizeMB) {
        alert(`Arquivo muito grande. Máximo ${maxSizeMB}MB`);
        return;
      }

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);

      // Upload image
      uploadImage(file, { type, id }).then((url) => {
        if (url && onUploadComplete) {
          onUploadComplete(url);
        }
      });
    }
  };

  const handleRemoveImage = () => {
    setPreviewUrl(null);
    resetUpload();
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        accept={acceptedFormats.join(',')}
        className="hidden"
      />
      
      {!previewUrl && !isUploading && (
        <Button 
          variant="outline" 
          onClick={() => fileInputRef.current?.click()}
          className="flex items-center gap-2"
        >
          <Upload className="h-4 w-4" />
          Selecionar Imagem
        </Button>
      )}

      {isUploading && (
        <div className="flex flex-col items-center space-y-2">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <Progress value={uploadProgress} className="w-64" />
          <p className="text-sm text-gray-500">Enviando... {uploadProgress}%</p>
        </div>
      )}

      {previewUrl && !isUploading && (
        <div className="relative">
          <img 
            src={previewUrl} 
            alt="Preview" 
            className="max-w-64 max-h-64 rounded-lg object-cover"
          />
          <button
            onClick={handleRemoveImage}
            className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {error && (
        <div className="text-red-500 text-sm">
          {error}
        </div>
      )}
    </div>
  );
}
