'use client';
import { createContext, useContext, useEffect, useState } from 'react';
import { auth, googleProvider } from '@/lib/firebase';
import { signInWithPopup, signOut, onAuthStateChanged, signInAnonymously, linkWithPopup } from 'firebase/auth';

const AuthContext = createContext({
  user: null,
  loading: true,
  signInWithGoogle: () => Promise.resolve(),
  signInAsGuest: () => Promise.resolve(),
  linkAccount: () => Promise.resolve(),
  logout: () => Promise.resolve(),
});

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (usr) => {
      if (usr) {
        setUser({
          uid: usr.uid,
          name: usr.displayName || "Misafir Badici",
          email: usr.email || "anonim@chadfocus.local",
          image: usr.photoURL || null,
          isAnonymous: usr.isAnonymous,
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error("Giriş hatası:", error);
      throw error;
    }
  };

  const signInAsGuest = async () => {
    try {
      await signInAnonymously(auth);
    } catch (error) {
      console.error("Misafir girişi hatası:", error);
      throw error;
    }
  };

  const linkAccount = async () => {
    try {
      if (auth.currentUser) {
        const result = await linkWithPopup(auth.currentUser, googleProvider);
        const usr = result.user;
        setUser({
          uid: usr.uid,
          name: usr.displayName || "Misafir Badici",
          email: usr.email || "anonim@chadfocus.local",
          image: usr.photoURL || null,
          isAnonymous: usr.isAnonymous,
        });
      }
    } catch (error) {
      console.error("Hesap bağlama hatası:", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Çıkış hatası:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signInWithGoogle, signInAsGuest, linkAccount, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);