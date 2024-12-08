import { useState, useEffect } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import type { UserProfile } from '@/types/auth';

export function useAuth() {
  const [user, setUser] = useState<(User & { profile?: UserProfile }) | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          const profile = userDoc.exists() 
            ? { ...userDoc.data(), uid: firebaseUser.uid } as UserProfile 
            : undefined;
          
          console.log('User Profile:', profile); // Depuração
          console.log('User Type:', profile?.type); // Novo log detalhado
          console.log('Full User Object:', { 
            uid: firebaseUser.uid, 
            email: firebaseUser.email, 
            profile 
          });

          setUser({ ...firebaseUser, profile });
        } catch (error) {
          console.error('Error fetching user profile:', error);
          setUser(firebaseUser);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const isAdmin = user?.profile?.type === 'admin';
  const isAdvertiser = user?.profile?.type === 'company';

  console.log('Is Advertiser:', isAdvertiser); // Depuração
  console.log('Is Admin:', isAdmin); // Novo log

  return {
    user,
    loading,
    isAuthenticated: !!user,
    isAdmin,
    isAdvertiser
  };
}
