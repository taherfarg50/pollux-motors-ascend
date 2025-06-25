import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { Session, User, AuthError } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

interface AuthContextProps {
  session: Session | null;
  user: User | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  loading: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Initialize authentication state
  useEffect(() => {
    const initAuth = async () => {
      try {
        // First check for existing session
        const { data: { session } } = await supabase.auth.getSession();
        setSession(session);
        setUser(session?.user ?? null);
        
        // Then set up auth state listener
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          (event, session) => {
            setSession(session);
            setUser(session?.user ?? null);
            
            if (event === 'SIGNED_IN') {
              toast({
                title: "Signed in successfully",
                description: "Welcome to Pollux Motors.",
              });
            } else if (event === 'SIGNED_OUT') {
              toast({
                title: "Signed out successfully",
                description: "You have been logged out.",
              });
            }
          }
        );
        
        return () => {
          subscription.unsubscribe();
        };
      } catch (err) {
        console.error('Error initializing auth:', err);
      } finally {
        setLoading(false);
      }
    };
    
    initAuth();
  }, [toast]);

  // Sign in with email and password
  const signIn = useCallback(async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
    } catch (error: unknown) {
      const authError = error as AuthError;
      setError(authError.message || 'Failed to sign in');
      toast({
        variant: "destructive",
        title: "Error signing in",
        description: authError.message || 'Failed to sign in',
      });
      throw error;
    } finally {
      setLoading(false);
    }
  }, [toast]);

  // Sign up with email and password
  const signUp = useCallback(async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth`,
        }
      });
      
      if (error) throw error;
      
      toast({
        title: "Account created",
        description: "Please check your email to verify your account.",
      });
    } catch (error: unknown) {
      const authError = error as AuthError;
      setError(authError.message || 'Failed to create account');
      toast({
        variant: "destructive",
        title: "Error creating account",
        description: authError.message || 'Failed to create account',
      });
      throw error;
    } finally {
      setLoading(false);
    }
  }, [toast]);

  // Sign out the current user
  const signOut = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error: unknown) {
      const authError = error as AuthError;
      setError(authError.message || 'Failed to sign out');
      toast({
        variant: "destructive",
        title: "Error signing out",
        description: authError.message || 'Failed to sign out',
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  return (
    <AuthContext.Provider value={{ session, user, signIn, signUp, signOut, loading, error }}>
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
