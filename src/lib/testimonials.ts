import { supabase } from './supabase';

export interface Testimonial {
  id: string;
  name: string;
  title: string;
  quote: string;
  image_url: string;
  created_at: string;
  updated_at: string;
}

export const getTestimonials = async () => {
  try {
    const { data, error } = await supabase
      .from('testimonials')
      .select('*')
      .order('created_at', { ascending: true });

    if (error) throw error;

    return { success: true, testimonials: data };
  } catch (error) {
    console.error('Error fetching testimonials:', error);
    return { success: false, error };
  }
};