import { useState } from 'react';
import { uploadMachineImage, uploadBannerImage, uploadCategoryImage, uploadUserAvatar } from '@/lib/storage';
import Logger from '@/lib/logger';

type UploadFunction = (file: File) => Promise<string>;
type UploadFunctionWithId = (id: string, file: File) => Promise<string>;

interface ImageUploadOptions {
  type?: 'machine' | 'banner' | 'category' | 'avatar';
  id?: string;
}

export function useImageUpload() {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const uploadImage = async (file: File, options: ImageUploadOptions = {}) => {
    if (!file) {
      setError('Nenhum arquivo selecionado');
      return null;
    }

    setIsUploading(true);
    setError(null);
    setUploadProgress(0);

    try {
      let uploadFunction: UploadFunction | UploadFunctionWithId;

      switch (options.type) {
        case 'machine':
          if (!options.id) throw new Error('ID da máquina é obrigatório');
          uploadFunction = uploadMachineImage;
          break;
        case 'banner':
          uploadFunction = uploadBannerImage;
          break;
        case 'category':
          if (!options.id) throw new Error('ID da categoria é obrigatório');
          uploadFunction = uploadCategoryImage;
          break;
        case 'avatar':
          if (!options.id) throw new Error('ID do usuário é obrigatório');
          uploadFunction = uploadUserAvatar;
          break;
        default:
          throw new Error('Tipo de upload não especificado');
      }

      const url = options.id 
        ? await (uploadFunction as UploadFunctionWithId)(options.id, file)
        : await (uploadFunction as UploadFunction)(file);

      setImageUrl(url);
      setUploadProgress(100);
      return url;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      setError(errorMessage);
      Logger.error('Erro no upload de imagem', err as Error);
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  const resetUpload = () => {
    setIsUploading(false);
    setUploadProgress(0);
    setImageUrl(null);
    setError(null);
  };

  return {
    uploadImage,
    resetUpload,
    isUploading,
    uploadProgress,
    imageUrl,
    error
  };
}
