import { useState } from 'react';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { doc, updateDoc } from 'firebase/firestore';
import { storage, db } from '@/lib/firebase';
import { DEFAULT_CATEGORY_IMAGE } from '@/lib/constants';
import type { MACHINE_CATEGORIES } from '@/lib/constants';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { ImagePlus, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface CategoryHeaderProps {
  category: typeof MACHINE_CATEGORIES[0];
  totalMachines: number;
}

export function CategoryHeader({ category, totalMachines }: CategoryHeaderProps) {
  const { isAdvertiser } = useAuth();
  const [uploading, setUploading] = useState(false);
  const [categoryImage, setCategoryImage] = useState(category.image || DEFAULT_CATEGORY_IMAGE);

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = event.target.files?.[0];
      if (!file) {
        toast.error('Nenhum arquivo selecionado');
        return;
      }

      // Validações de imagem
      const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
      const maxSize = 5 * 1024 * 1024; // 5MB

      if (!validTypes.includes(file.type)) {
        toast.error('Tipo de arquivo inválido. Use JPEG, PNG ou WebP.');
        return;
      }

      if (file.size > maxSize) {
        toast.error('Imagem muito grande. Máximo de 5MB.');
        return;
      }

      setUploading(true);

      // Caminho único para a imagem
      const storageRef = ref(
        storage, 
        `categories/${category.id}/header_image_${Date.now()}.${file.type.split('/')[1]}`
      );

      // Upload da imagem
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);

      // Atualizar documento da categoria
      const categoryRef = doc(db, 'siteContent', category.id);
      await updateDoc(categoryRef, { 
        imageUrl: downloadURL,
        updatedAt: new Date()
      });

      // Atualizar estado local da imagem
      setCategoryImage(downloadURL);

      toast.success('Imagem da categoria atualizada com sucesso!');
    } catch (error) {
      console.error('Erro no upload:', error);
      toast.error('Não foi possível atualizar a imagem.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 relative">
      <div className="mb-8 overflow-hidden rounded-xl bg-white shadow-sm">
        <div className="relative aspect-[3/1] w-full">
          <img
            src={categoryImage}
            alt={category.name}
            className="h-full w-full object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = DEFAULT_CATEGORY_IMAGE;
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary-600/90 to-transparent" />
          <div className="absolute bottom-0 left-0 p-8">
            <h1 className="text-4xl font-bold text-white">{category.name}</h1>
            <p className="mt-2 text-lg text-white/90">
              {totalMachines} {totalMachines === 1 ? 'máquina disponível' : 'máquinas disponíveis'}
            </p>
          </div>

          {isAdvertiser && (
            <div className="absolute top-4 right-4 z-10">
              <input 
                type="file" 
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                id={`category-header-upload-${category.id}`}
                onChange={handleImageUpload}
                disabled={uploading}
              />
              <label htmlFor={`category-header-upload-${category.id}`}>
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30"
                  disabled={uploading}
                >
                  {uploading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <ImagePlus className="h-5 w-5" />
                  )}
                </Button>
              </label>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}