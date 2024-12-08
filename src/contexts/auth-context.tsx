import { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import type { UserProfile } from '@/types/auth';

interface AuthContextType {
  userProfile: UserProfile | null;
  loading: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextType>({
  userProfile: null,
  loading: true,
  error: null
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log('AuthProvider: Starting auth state listener');
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      try {
        console.log('AuthProvider: Auth state changed', user?.uid);
        if (user) {
          console.log('AuthProvider: User logged in:', user.uid);
          const docRef = doc(db, 'users', user.uid);
          const docSnap = await getDoc(docRef);
          
          if (docSnap.exists()) {
            const profile = { ...docSnap.data(), uid: user.uid } as UserProfile;
            console.log('AuthProvider: User profile loaded', profile);
            setUserProfile(profile);
          } else {
            console.error('AuthProvider: No user profile found for:', user.uid);
            setUserProfile(null);
            setError('Perfil de usuário não encontrado');
          }
        } else {
          console.log('AuthProvider: Auth state changed - User logged out');
          setUserProfile(null);
        }
      } catch (error) {
        console.error('AuthProvider: Error loading user profile:', error);
        setUserProfile(null);
        setError('Erro ao carregar perfil do usuário');
      } finally {
        setLoading(false);
      }
    });

    return () => {
      console.log('AuthProvider: Cleaning up auth state listener');
      unsubscribe();
    };
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4 h-8 w-8 animate-spin rounded-full border-4 border-primary-500 border-t-transparent"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="rounded-lg bg-red-50 p-4 text-center">
          <h2 className="mb-2 text-lg font-semibold text-red-700">Erro</h2>
          <p className="text-red-600">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700"
          >
            Tentar Novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ userProfile, loading, error }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
}