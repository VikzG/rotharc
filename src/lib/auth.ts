import { supabase } from './supabase';
import { toast } from 'react-hot-toast';

export interface SignUpData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface SignInData {
  email: string;
  password: string;
}

export const signUp = async ({ email, password, firstName, lastName }: SignUpData) => {
  try {
    const { data: authData, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: firstName,
          last_name: lastName,
        },
      },
    });

    if (signUpError) {
      throw signUpError;
    }

    if (!authData.user) {
      throw new Error('No user data returned');
    }

    toast.success('Compte créé avec succès ! Vous pouvez maintenant vous connecter.');
    return { success: true };

  } catch (error: any) {
    console.error('Error signing up:', error);
    
    if (error.message?.includes('User already registered')) {
      toast.error('Un compte existe déjà avec cet email');
    } else if (error.message?.includes('Password should be')) {
      toast.error('Le mot de passe doit contenir au moins 6 caractères');
    } else {
      toast.error('Erreur lors de la création du compte. Veuillez réessayer.');
    }
    
    return { success: false, error };
  }
};

export const signIn = async ({ email, password }: SignInData) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error('SignIn error:', error);
      throw error;
    }

    if (!data.user) {
      console.error('No user data returned from signIn');
      throw new Error('No user data returned');
    }

    toast.success('Connexion réussie !');
    return { success: true, user: data.user };

  } catch (error: any) {
    console.error('Error in signIn:', error);
    
    if (error.message?.includes('Invalid login credentials')) {
      toast.error('Email ou mot de passe incorrect');
    } else {
      toast.error('Erreur de connexion. Veuillez réessayer.');
    }
    
    return { success: false, error };
  }
};

export const signOut = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    
    toast.success('Déconnexion réussie !');
    return { success: true };
  } catch (error) {
    console.error('Error signing out:', error);
    toast.error('Erreur lors de la déconnexion.');
    return { success: false, error };
  }
};

export const deleteAccount = async () => {
  try {
    const { error } = await supabase.auth.admin.deleteUser(
      (await supabase.auth.getUser()).data.user?.id || ''
    );
    
    if (error) throw error;
    
    toast.success('Votre compte a été supprimé avec succès.');
    return { success: true };
  } catch (error) {
    console.error('Error deleting account:', error);
    toast.error('Erreur lors de la suppression du compte.');
    return { success: false, error };
  }
};

export const getCurrentUser = async () => {
  try {
    console.log('Fetching current user...');
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError) {
      console.error('Error fetching user:', userError);
      return null;
    }

    if (!user) {
      console.log('No user found');
      return null;
    }

    console.log('User found, fetching profile...');
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (profileError) {
      console.warn('Error fetching profile:', profileError);
      return { user, profile: null };
    }

    console.log('Profile found, returning data');
    return { user, profile };
  } catch (error) {
    console.error('Error in getCurrentUser:', error);
    return null;
  }
};