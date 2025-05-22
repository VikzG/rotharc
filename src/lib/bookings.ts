import { supabase } from './supabase';
import { toast } from 'react-hot-toast';

export interface CreateBookingData {
  userId: string;
  productId: string;
  bookingDate: Date;
  bookingTime: string;
}

export const createBooking = async ({
  userId,
  productId,
  bookingDate,
  bookingTime,
}: CreateBookingData) => {
  try {
    const { data, error } = await supabase
      .from('bookings')
      .insert({
        user_id: userId,
        product_id: productId,
        booking_date: bookingDate.toISOString(),
        booking_time: bookingTime,
      })
      .select()
      .single();

    if (error) throw error;

    toast.success('Réservation créée avec succès !');
    return { success: true, booking: data };
  } catch (error) {
    console.error('Error creating booking:', error);
    toast.error('Erreur lors de la création de la réservation.');
    return { success: false, error };
  }
};

export const getUserBookings = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .eq('user_id', userId)
      .order('booking_date', { ascending: true });

    if (error) throw error;

    return { success: true, bookings: data };
  } catch (error) {
    console.error('Error fetching user bookings:', error);
    return { success: false, error };
  }
};

export const updateBookingStatus = async (bookingId: string, status: 'confirmed' | 'cancelled') => {
  try {
    const { data, error } = await supabase
      .from('bookings')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', bookingId)
      .select()
      .single();

    if (error) throw error;

    toast.success(`Réservation ${status === 'confirmed' ? 'confirmée' : 'annulée'} !`);
    return { success: true, booking: data };
  } catch (error) {
    console.error('Error updating booking status:', error);
    toast.error('Erreur lors de la mise à jour de la réservation.');
    return { success: false, error };
  }
};