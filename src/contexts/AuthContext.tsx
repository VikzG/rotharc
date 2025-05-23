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
    let mounted = true;

    async function initAuth() {
      try {
        setLoading(true);
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('Session error:', sessionError);
          if (mounted) {
            setUser(null);
            setProfile(null);
          }
          return;
        }

        if (!session) {
          if (mounted) {
            setUser(null);
            setProfile(null);
          }
          return;
        }

        const data = await getCurrentUser();
        
        if (!mounted) return;

        if (data) {
          setUser(data.user);
          setProfile(data.profile);
        } else {
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
          setLoading(false);
        }
      }
    }

    initAuth();

    const { data: listener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return;

      setLoading(true);
      
      if (session) {
        try {
          const data = await getCurrentUser();
          if (!mounted) return;
          
          setUser(data?.user || null);
          setProfile(data?.profile || null);
        } catch (error) {
          console.error('Error updating auth state:', error);
          setUser(null);
          setProfile(null);
        }
      } else {
        setUser(null);
        setProfile(null);
      }
      
      setLoading(false);
    });

    return () => {
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