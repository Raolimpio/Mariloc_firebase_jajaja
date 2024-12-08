import React, { useRef, useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Loader2, UploadIcon } from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { doc, updateDoc } from 'firebase/firestore';
import { storage, db } from '@/lib/firebase';

interface CategoryImageUploadProps {
  categoryId: string;
  currentImageUrl?: string;
  className?: string;
}

export function CategoryImageUpload({
  categoryId,
  currentImageUrl,
  className,
}: CategoryImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const { userProfile } = useAuth();
  const inputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Por favor, selecione uma imagem');
      return;
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('A imagem deve ter menos de 5MB');
      return;
    }

    try {
      setUploading(true);

      // Create a unique file path
      const timestamp = Date.now();
      const fileExtension = file.name.split('.').pop();
      const filePath = `categories/${categoryId}/banner_${timestamp}.${fileExtension}`;
      
      // Upload to Firebase Storage
      const storageRef = ref(storage, filePath);
      const snapshot = await uploadBytes(storageRef, file);
      console.log('Image uploaded successfully:', snapshot.metadata);
      
      // Get download URL
      const downloadURL = await getDownloadURL(snapshot.ref);
      console.log('Image download URL:', downloadURL);

      // Update Firestore document
      const categoryRef = doc(db, 'siteContent', categoryId);
      await updateDoc(categoryRef, {
        imageUrl: downloadURL,
        updatedAt: new Date()
      });

      toast.success('Imagem atualizada com sucesso!');
      
      // Reset input
      if (inputRef.current) {
        inputRef.current.value = '';
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Falha ao atualizar a imagem');
    } finally {
      setUploading(false);
    }
  };

  // Only show for company users
  if (userProfile?.type !== 'company') {
    return null;
  }

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        style={{ display: 'none' }}
        data-testid="file-input"
      />
      <Button
        variant="outline"
        size="icon"
        className="absolute top-4 right-4 z-50 bg-white/20 backdrop-blur-sm hover:bg-white/30"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          inputRef.current?.click();
        }}
        disabled={uploading}
        data-upload-button="true"
      >
        {uploading ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : (
          <UploadIcon className="h-5 w-5" />
        )}
      </Button>
    </>
  );
}
