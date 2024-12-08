import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export async function updateCategoryImage(categoryId: string, imageUrl: string): Promise<void> {
  try {
    const categoryRef = doc(db, 'siteContent', categoryId);
    
    await updateDoc(categoryRef, {
      imageUrl: imageUrl,
      updatedAt: new Date()
    });
    
    console.log('Category document updated with new image URL');
  } catch (error) {
    console.error('Error updating category document:', error);
    throw new Error('Failed to update category image');
  }
}
