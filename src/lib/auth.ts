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

    console.log('Creating profile for user:', authData.user.id);
    
    const { error: profileError } = await supabase
      .from('profiles')
      .insert([
        {
          id: authData.user.id,
          first_name: firstName,
          last_name: lastName,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }
      ]);

    if (profileError) {
      console.error('Error creating profile:', profileError);
      throw profileError;
    }

    console.log('Profile created successfully');
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
  console.log('Starting signIn process...');
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

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', data.user.id)
      .single();

    if (profileError) {
      console.error('Profile fetch error:', profileError);
      if (profileError.code === 'PGRST116') {
        console.log('Profile not found, creating new profile...');
        const { data: newProfile, error: createError } = await supabase
          .from('profiles')
          .insert([
            {
              id: data.user.id,
              first_name: data.user.user_metadata?.first_name || '',
              last_name: data.user.user_metadata?.last_name || '',
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            }
          ])
          .select()
          .single();

        if (createError) {
          console.error('Error creating profile during signin:', createError);
          throw createError;
        }

        profile = newProfile;
      } else {
        throw profileError;
      }
    }

    toast.success('Connexion réussie !');
    return { success: true, user: data.user, profile };

  } catch (error: any) {
    console.error('Error in signIn:', error);
    
    if (error.message?.includes('Invalid login credentials')) {
      toast.error('Email ou mot de passe incorrect');
    } else {
      toast.error('Erreur de connexion. Veuillez réessayer.');
    }
    
    throw error;
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
  console.log('Fetching current user...');
  try {
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError) {
      console.error('Error fetching user:', userError);
      return null;
    }

    if (!user) {
      console.log('No user found');
      return null;
    }

    console.log('Fetching user profile...', user.id);
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (profileError) {
      if (profileError.code === 'PGRST116') {
        console.log('Profile not found, creating new profile...');
        const { data: newProfile, error: createError } = await supabase
          .from('profiles')
          .insert([
            {
              id: user.id,
              first_name: user.user_metadata?.first_name || '',
              last_name: user.user_metadata?.last_name || '',
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            }
          ])
          .select()
          .single();

        if (createError) {
          console.error('Error creating profile:', createError);
          return { user, profile: null };
        }

        return { user, profile: newProfile };
      }
      
      console.error('Error fetching profile:', profileError);
      return { user, profile: null };
    }

    return { user, profile };
  } catch (error) {
    console.error('Error in getCurrentUser:', error);
    return null;
  }
};