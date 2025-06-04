import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Navigation } from '../../components/Navigation';
import { Footer } from '../../components/Footer';
import { Button } from '../../components/ui/button';
import { useAuth } from '../../contexts/AuthContext';
import { Calendar, Clock, MapPin, Mail, Phone, FileText } from 'lucide-react';
import { getUserBookings, updateBookingStatus } from '../../lib/bookings';
import { getProductById } from '../../lib/products';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export const ReservationsPage = () => {
  const { user } = useAuth();
  const [isNavVisible, setIsNavVisible] = useState(true);
  const [bookings, setBookings] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState<string | null>(null);

  useEffect(() => {
    const fetchBookings = async () => {
      if (user) {
        const { success, bookings: userBookings } = await getUserBookings(user.id);
        if (success && userBookings) {
          setBookings(userBookings);
        }
        setIsLoading(false);
      }
    };

    fetchBookings();
  }, [user]);

  const handleCancelBooking = async (bookingId: string) => {
    const result = await updateBookingStatus(bookingId, 'cancelled');
    if (result.success) {
      setBookings(bookings.map(booking => 
        booking.id === bookingId ? { ...booking, status: 'cancelled' } : booking
      ));
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'text-green-500';
      case 'cancelled':
        return 'text-red-500';
      default:
        return 'text-yellow-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'Confirmée';
      case 'cancelled':
        return 'Annulée';
      default:
        return 'En attente';
    }
  };

  const toggleBookingDetails = (bookingId: string) => {
    setSelectedBooking(selectedBooking === bookingId ? null : bookingId);
  };

  return (
    <div className="min-h-screen bg-[#d9d9d9]">
      <Navigation isNavVisible={isNavVisible} toggleNav={() => setIsNavVisible(!isNavVisible)} />

      <main className="pt-32 px-8 max-w-[1368px] mx-auto mb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-4xl font-semibold mb-4 text-center [font-family:'Montserrat_Alternates',Helvetica]">
            Mes Réservations
          </h1>
          <p className="text-lg text-center text-[#443f3f] mb-12 [font-family:'Montserrat_Alternates',Helvetica]">
            Suivez l'état de vos réservations d'améliorations
          </p>
        </motion.div>

        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-[#2C3E50] [font-family:'Montserrat_Alternates',Helvetica]">
              Chargement de vos réservations...
            </p>
          </div>
        ) : bookings.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-[#2C3E50] [font-family:'Montserrat_Alternates',Helvetica]">
              Vous n'avez pas encore de réservations.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {bookings.map((booking) => {
              const product = getProductById(booking.product_id);
              if (!product) return null;

              return (
                <motion.div
                  key={booking.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-[#d9d9d9] rounded-[25px] p-6 shadow-[15px_15px_38px_#989898e6,-15px_-15px_30px_#ffffffe6]"
                >
                  <div className="flex flex-col md:flex-row justify-between items-start gap-6">
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-4">
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          className="w-16 h-16 rounded-lg object-cover"
                        />
                        <div>
                          <h3 className="text-xl font-medium text-[#2C3E50] [font-family:'Montserrat_Alternates',Helvetica]">
                            {product.name}
                          </h3>
                          <p className="text-sm text-[#443f3f] [font-family:'Montserrat_Alternates',Helvetica]">
                            {product.category} - {product.subCategory}
                          </p>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-5 h-5 text-[#2C8DB0]" />
                          <span className="text-[#2C3E50] [font-family:'Montserrat_Alternates',Helvetica]">
                            {format(new Date(booking.booking_date), 'EEEE dd MMMM yyyy', { locale: fr })}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-5 h-5 text-[#2C8DB0]" />
                          <span className="text-[#2C3E50] [font-family:'Montserrat_Alternates',Helvetica]">
                            {booking.booking_time}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-5 h-5 text-[#2C8DB0]" />
                          <span className="text-[#2C3E50] [font-family:'Montserrat_Alternates',Helvetica]">
                            Centre Rotharc - 72 Rue du Futur, Paris 75001
                          </span>
                        </div>
                      </div>

                      <Button
                        onClick={() => toggleBookingDetails(booking.id)}
                        className="mt-4 text-[#2C8DB0] hover:text-[#2C8DB0]/80 [font-family:'Montserrat_Alternates',Helvetica]"
                      >
                        {selectedBooking === booking.id ? 'Masquer les détails' : 'Voir les détails'}
                      </Button>

                      {selectedBooking === booking.id && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="mt-4 space-y-2 bg-[#d9d9d9] rounded-[15px] p-4 shadow-[inset_5px_5px_13px_#a3a3a3e6,inset_-5px_-5px_10px_#ffffffe6]"
                        >
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <h4 className="font-medium text-[#2C3E50] mb-2 [font-family:'Montserrat_Alternates',Helvetica]">
                                Informations personnelles
                              </h4>
                              <div className="space-y-2">
                                <p className="text-[#443f3f] [font-family:'Montserrat_Alternates',Helvetica]">
                                  {booking.first_name} {booking.last_name}
                                </p>
                                <div className="flex items-center gap-2">
                                  <Mail className="w-4 h-4 text-[#2C8DB0]" />
                                  <span className="text-[#443f3f] [font-family:'Montserrat_Alternates',Helvetica]">
                                    {booking.email}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Phone className="w-4 h-4 text-[#2C8DB0]" />
                                  <span className="text-[#443f3f] [font-family:'Montserrat_Alternates',Helvetica]">
                                    {booking.phone}
                                  </span>
                                </div>
                              </div>
                            </div>
                            
                            <div>
                              <h4 className="font-medium text-[#2C3E50] mb-2 [font-family:'Montserrat_Alternates',Helvetica]">
                                Adresse
                              </h4>
                              <p className="text-[#443f3f] [font-family:'Montserrat_Alternates',Helvetica]">
                                {booking.address}<br />
                                {booking.city}, {booking.postal_code}
                              </p>
                            </div>
                          </div>

                          {booking.installation_notes && (
                            <div className="mt-4">
                              <h4 className="font-medium text-[#2C3E50] mb-2 flex items-center gap-2 [font-family:'Montserrat_Alternates',Helvetica]">
                                <FileText className="w-4 h-4 text-[#2C8DB0]" />
                                Notes d'installation
                              </h4>
                              <p className="text-[#443f3f] [font-family:'Montserrat_Alternates',Helvetica]">
                                {booking.installation_notes}
                              </p>
                            </div>
                          )}
                        </motion.div>
                      )}
                    </div>

                    <div className="flex flex-col items-end gap-4">
                      <div className="text-right">
                        <p className="text-2xl font-semibold text-[#2C8DB0] [font-family:'Montserrat_Alternates',Helvetica]">
                          {product.price.toLocaleString()} €
                        </p>
                        <p className={`text-sm font-medium ${getStatusColor(booking.status)} [font-family:'Montserrat_Alternates',Helvetica]`}>
                          {getStatusText(booking.status)}
                        </p>
                      </div>

                      {booking.status === 'pending' && (
                        <Button
                          onClick={() => handleCancelBooking(booking.id)}
                          className="px-6 bg-[#d9d9d9] text-red-500 shadow-[5px_5px_13px_#a3a3a3e6,-5px_-5px_10px_#ffffffe6] hover:shadow-[0_0_20px_rgba(244,63,94,0.3)] hover:text-red-600 transition-all duration-300 [font-family:'Montserrat_Alternates',Helvetica]"
                        >
                          Annuler
                        </Button>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};