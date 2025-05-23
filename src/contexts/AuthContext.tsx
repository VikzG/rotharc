import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { getCurrentUser } from '../lib/auth';

interface AuthContextType {
  user: any | null;
  profile: any | null;
  loading: boolean;
  setUser: React.Dispatch<React.SetStateAction<any | null>>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  loading: true,
  setUser: () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any | null>(null);
  const [profile, setProfile] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('AuthProvider mounted');
    let mounted = true;

    async function initAuth() {
      console.log('Initializing auth...');
      try {
        const data = await getCurrentUser();
        console.log('InitAuth response:', data);
        
        if (!mounted) {
          console.log('Component unmounted, skipping state update');
          return;
        }

        if (data) {
          console.log('Setting user and profile data');
          setUser(data.user);
          setProfile(data.profile);
        } else {
          console.log('No user data, clearing state');
          setUser(null);
          setProfile(null);
        }
      } catch (error) {
        console.error('Error in initAuth:', error);
        if (mounted) {
          setUser(null);
          setProfile(null);
        }
      } finally {
        if (mounted) {
          console.log('Setting loading to false');
          setLoading(false);
        }
      }
    }

    initAuth();

    const { data: listener } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session);
      if (!mounted) {
        console.log('Component unmounted, skipping auth state change');
        return;
      }

      if (session) {
        console.log('Session exists, fetching user data');
        const data = await getCurrentUser();
        if (mounted) {
          console.log('Setting user data from auth change');
          setUser(data?.user || null);
          setProfile(data?.profile || null);
        }
      } else {
        console.log('No session, clearing user data');
        if (mounted) {
          setUser(null);
          setProfile(null);
        }
      }
      
      if (mounted) {
        console.log('Setting loading to false after auth change');
        setLoading(false);
      }
    });

    return () => {
      console.log('AuthProvider unmounting');
      mounted = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, profile, loading, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};