import React, { useState, useEffect, ReactNode } from 'react';
import { auth, signInWithGoogle, logout } from '@/src/lib/firebase';
import { User as FirebaseUser, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/src/lib/firebase';
import { User, UserRole } from '@/src/types';
import { Card, CardTitle, CardDescription } from './ui/Card';
import { Button } from './ui/Button';
import { LogIn } from 'lucide-react';

interface AuthProviderProps {
  children: (user: User | null, loading: boolean) => ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
        
        if (userDoc.exists()) {
          const userData = userDoc.data() as User;
          // Force upgrade to Admin for the specific user email if not already set
          if (firebaseUser.email === 'sreejal2003@gmail.com' && userData.role !== 'Admin') {
            const updatedUser = { ...userData, role: 'Admin' as UserRole };
            await setDoc(doc(db, 'users', firebaseUser.uid), updatedUser, { merge: true });
            setUser(updatedUser);
          } else {
            setUser(userData);
          }
        } else {
          // New user defaults to Member
          // If the email is the one mentioned in metadata, make them an Admin
          const role: UserRole = firebaseUser.email === 'sreejal2003@gmail.com' ? 'Admin' : 'Member';
          
          const newUser: User = {
            id: firebaseUser.uid,
            name: firebaseUser.displayName || 'Anonymous',
            email: firebaseUser.email || '',
            role: role,
            avatarUrl: firebaseUser.photoURL || undefined,
          };
          await setDoc(doc(db, 'users', firebaseUser.uid), newUser);
          setUser(newUser);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  return <>{children(user, loading)}</>;
}

export function LoginPage() {
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async () => {
    try {
      await signInWithGoogle();
    } catch (err) {
      setError('Failed to sign in with Google');
      console.error(err);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-black p-4">
      <Card className="w-full max-w-md text-center">
        <div className="mb-8 flex justify-center">
          <div className="h-12 w-12 rounded-xl bg-white flex items-center justify-center shadow-lg shadow-white/10">
            <span className="text-black font-extrabold text-2xl">E</span>
          </div>
        </div>
        <CardTitle className="text-2xl font-bold">Welcome to EtherAi</CardTitle>
        <CardDescription className="mt-2">
          Collaborative task management for high-performance teams.
        </CardDescription>
        
        <div className="mt-10 space-y-4">
          <Button 
            variant="primary" 
            className="w-full h-12 text-base gap-3"
            onClick={handleLogin}
          >
            <LogIn size={20} />
            Sign in with Google
          </Button>
          
          {error && <p className="text-xs text-red-500 mt-2">{error}</p>}
          
          <p className="text-xs text-zinc-500 pt-4">
            By signing in, you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>
      </Card>
    </div>
  );
}
