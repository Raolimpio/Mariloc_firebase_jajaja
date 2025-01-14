import { collection, doc, addDoc, updateDoc, deleteDoc, getDocs, query, where, orderBy, serverTimestamp, getDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from './firebase';

// Types
export interface SiteContent {
  id: string;
  type: 'banner' | 'category' | 'phase';
  title: string;
  description?: string;
  imageUrl?: string;
  link?: string;
  icon?: string;
  order: number;
  active: boolean;
  category?: string;
  machines?: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface CategoryIcon {
  id: string;
  name: string;
  icon: string;
  imageUrl?: string;
  order: number;
  active: boolean;
}

export interface ProductVideo {
  id: string;
  productId: string;
  title: string;
  videoUrl: string;
  thumbnailUrl?: string;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

// Content Functions
export async function getContent(type: SiteContent['type']) {
  try {
    const contentRef = collection(db, 'siteContent');
    const q = query(
      contentRef, 
      where('type', '==', type),
      where('active', '==', true),
      orderBy('order', 'asc')
    );
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate(),
      updatedAt: doc.data().updatedAt?.toDate(),
    })) as SiteContent[];
  } catch (error) {
    console.error('Error getting content:', error);
    throw error;
  }
}

export async function getCategoryIcons() {
  try {
    const iconsRef = collection(db, 'categoryIcons');
    const q = query(iconsRef, orderBy('order', 'asc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as CategoryIcon[];
  } catch (error) {
    console.error('Error getting category icons:', error);
    throw error;
  }
}

export async function updateCategoryIcon(id: string, data: Partial<CategoryIcon>) {
  try {
    const iconRef = doc(db, 'categoryIcons', id);
    await updateDoc(iconRef, {
      ...data,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error updating category icon:', error);
    throw error;
  }
}

export async function createContent(data: Omit<SiteContent, 'id' | 'createdAt' | 'updatedAt'>) {
  try {
    const contentRef = collection(db, 'siteContent');
    const docRef = await addDoc(contentRef, {
      ...data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    console.error('Error creating content:', error);
    throw error;
  }
}

export async function updateContent(id: string, data: Partial<SiteContent>) {
  try {
    const contentRef = doc(db, 'siteContent', id);
    await updateDoc(contentRef, {
      ...data,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error('Error updating content:', error);
    throw error;
  }
}

export async function deleteContent(id: string) {
  try {
    const contentRef = doc(db, 'siteContent', id);
    await deleteDoc(contentRef);
  } catch (error) {
    console.error('Error deleting content:', error);
    throw error;
  }
}

// Category Management Functions
export async function getCategories(): Promise<SiteContent[]> {
  try {
    const contentRef = collection(db, 'siteContent');
    const q = query(
      contentRef, 
      where('type', '==', 'category'),
      where('active', '==', true),
      orderBy('order', 'asc')
    );
    
    const querySnapshot = await getDocs(q);
    const categories: SiteContent[] = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as SiteContent));
    
    return categories;
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}

export async function createCategory(categoryData: Omit<SiteContent, 'id' | 'createdAt' | 'updatedAt'>) {
  try {
    const newCategory = await createContent({
      ...categoryData,
      type: 'category',
      order: categoryData.order || 0,
      active: categoryData.active ?? true
    });
    return newCategory;
  } catch (error) {
    console.error('Error creating category:', error);
    throw error;
  }
}

export async function updateCategory(categoryId: string, data: Partial<SiteContent>) {
  try {
    await updateContent(categoryId, {
      ...data,
      type: 'category'
    });
  } catch (error) {
    console.error('Error updating category:', error);
    throw error;
  }
}

export async function deleteCategory(categoryId: string) {
  try {
    // Optional: Delete associated image from storage before deleting document
    const categoryDoc = await getDoc(doc(db, 'siteContent', categoryId));
    const categoryData = categoryDoc.data() as SiteContent;
    
    if (categoryData?.imageUrl) {
      await deleteContentImage(categoryData.imageUrl);
    }
    
    await deleteContent(categoryId);
  } catch (error) {
    console.error('Error deleting category:', error);
    throw error;
  }
}

// Product Video Functions
export async function getProductVideos(productId: string) {
  try {
    const videosRef = collection(db, 'productVideos');
    const q = query(
      videosRef,
      where('productId', '==', productId),
      orderBy('order', 'asc')
    );
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate(),
      updatedAt: doc.data().updatedAt?.toDate(),
    })) as ProductVideo[];
  } catch (error) {
    console.error('Error getting product videos:', error);
    throw error;
  }
}

export async function addProductVideo(data: Omit<ProductVideo, 'id' | 'createdAt' | 'updatedAt'>) {
  try {
    const videosRef = collection(db, 'productVideos');
    const docRef = await addDoc(videosRef, {
      ...data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    console.error('Error adding product video:', error);
    throw error;
  }
}

export async function updateProductVideo(id: string, data: Partial<ProductVideo>) {
  try {
    const videoRef = doc(db, 'productVideos', id);
    await updateDoc(videoRef, {
      ...data,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error('Error updating product video:', error);
    throw error;
  }
}

export async function deleteProductVideo(id: string) {
  try {
    const videoRef = doc(db, 'productVideos', id);
    await deleteDoc(videoRef);
  } catch (error) {
    console.error('Error deleting product video:', error);
    throw error;
  }
}

// Image Upload Functions
export async function uploadContentImage(file: File, path: string) {
  try {
    const storageRef = ref(storage, `content/${path}/${Date.now()}-${file.name}`);
    await uploadBytes(storageRef, file);
    return getDownloadURL(storageRef);
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
}

export async function deleteContentImage(url: string) {
  try {
    if (!url.startsWith('https://firebasestorage.googleapis.com')) {
      return;
    }
    const storageRef = ref(storage, url);
    await deleteObject(storageRef);
  } catch (error) {
    console.error('Error deleting image:', error);
    throw error;
  }
}