import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '@/lib/firebase';

export async function uploadCategoryImage(categoryId: string, file: File): Promise<string> {
  try {
    // Create a unique file path with timestamp
    const timestamp = Date.now();
    const fileExtension = file.name.split('.').pop();
    const filePath = `categories/${categoryId}/banner_${timestamp}.${fileExtension}`;
    
    // Create storage reference
    const storageRef = ref(storage, filePath);
    
    // Upload the file
    const snapshot = await uploadBytes(storageRef, file);
    console.log('Image uploaded successfully:', snapshot.metadata);
    
    // Get download URL
    const downloadURL = await getDownloadURL(snapshot.ref);
    console.log('Image download URL:', downloadURL);
    
    return downloadURL;
  } catch (error) {
    console.error('Error uploading category image:', error);
    throw new Error('Failed to upload image');
  }
}
