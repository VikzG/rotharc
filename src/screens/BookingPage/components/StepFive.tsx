import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '../../../components/ui/button';
import { CheckCircle } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { getProductById } from '../../../lib/products';
import { Link } from 'react-router-dom';
import { createBooking } from '../../../lib/bookings';
import { useAuth } from '../../../contexts/AuthContext';
import { Product } from '../../../types';

interface StepFiveProps {
  selectedProductId: string | null;
  selectedDate: Date | undefined;
  selectedTime: string | null;
  formData: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    postalCode: string;
    installationNotes: string;
  };
  onReset: () => void;
}

export const StepFive = ({
  selectedProductId,
  selectedDate,
  selectedTime,
  formData,
  onReset
}: StepFiveProps) => {
  const { user } = useAuth();
  const [selectedProduct, setSelectedProduct] = React.useState<Product | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const reservationNumber = `CYB-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;

  React.useEffect(() => {
    const fetchProduct = async () => {
      if (selectedProductId) {
        const product = await getProductById(selectedProductId);
        setSelectedProduct(product);
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [selectedProductId]);

  React.useEffect(() => {
    const saveBooking = async () => {
      if (user && selectedProduct && selectedDate && selectedTime) {
        await createBooking({
          userId: user.id,
          productId: selectedProduct.id,
          bookingDate: selectedDate,
          bookingTime: selectedTime,
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          postalCode: formData.postalCode,
          installationNotes: formData.installationNotes,
        });
      }
    };

    saveBooking();
  }, [selectedProduct]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-[#2C3E50] text-xl [font-family:'Montserrat_Alternates',Helvetica]">
          Finalisation de votre réservation...
        </p>
      </div>
    );
  }

  if (!selectedProduct || !selectedDate || !selectedTime) {
    return null;
  }

  const deposit = Math.round(selectedProduct.price * 0.3);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="text-center py-8"
    >
      <div className="bg-[#2C8DB0] p-4 rounded-full inline-flex items-center justify-center mb-6 shadow-[0_0_20px_rgba(44,141,176,0.3)]">
        <CheckCircle className="h-16 w-16 text-white" />
      </div>
      
      <h2 className="text-2xl font-semibold text-[#2C3E50] mb-4 [font-family:'Montserrat_Alternates',Helvetica]">
        Réservation Confirmée!
      </h2>
      
      <p className="text-[#443f3f] mb-6 max-w-lg mx-auto [font-family:'Montserrat_Alternates',Helvetica]">
        Votre réservation a été enregistrée avec succès. Un email de confirmation a été envoyé à{' '}
        <span className="text-[#2C8DB0]">{formData.email}</span>.
      </p>
      
      <div className="bg-[#d9d9d9] rounded-[15px] p-6 max-w-md mx-auto mb-8 shadow-[inset_5px_5px_13px_#a3a3a3e6,inset_-5px_-5px_10px_#ffffffe6]">
        <h3 className="text-lg font-medium text-[#2C3E50] mb-4 [font-family:'Montserrat_Alternates',Helvetica]">
          Détails de la Réservation
        </h3>
        
        <div className="space-y-3 text-left">
          <div className="flex justify-between">
            <span className="text-[#443f3f] [font-family:'Montserrat_Alternates',Helvetica]">
              Numéro de réservation:
            </span>
            <span className="text-[#2C3E50] font-mono [font-family:'Montserrat_Alternates',Helvetica]">
              {reservationNumber}
            </span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-[#443f3f] [font-family:'Montserrat_Alternates',Helvetica]">
              Service:
            </span>
            <span className="text-[#2C3E50] [font-family:'Montserrat_Alternates',Helvetica]">
              {selectedProduct.name}
            </span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-[#443f3f] [font-family:'Montserrat_Alternates',Helvetica]">
              Date et heure:
            </span>
            <span className="text-[#2C3E50] [font-family:'Montserrat_Alternates',Helvetica]">
              {format(selectedDate, 'dd MMMM yyyy', { locale: fr })} à {selectedTime}
            </span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-[#443f3f] [font-family:'Montserrat_Alternates',Helvetica]">
              Client:
            </span>
            <span className="text-[#2C3E50] [font-family:'Montserrat_Alternates',Helvetica]">
              {formData.firstName} {formData.lastName}
            </span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-[#443f3f] [font-family:'Montserrat_Alternates',Helvetica]">
              Acompte payé:
            </span>
            <span className="text-[#2C8DB0] font-medium [font-family:'Montserrat_Alternates',Helvetica]">
              {deposit.toLocaleString()} €
            </span>
          </div>
        </div>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button
          onClick={onReset}
          className="px-8 py-2 bg-[#2C8DB0] text-white hover:bg-[#2C8DB0]/90 shadow-[0_0_20px_rgba(44,141,176,0.3)] transition-all duration-300 [font-family:'Montserrat_Alternates',Helvetica]"
        >
          Nouvelle Réservation
        </Button>
        <Link to="/">
          <Button
            className="px-8 py-2 bg-[#d9d9d9] text-[#2C3E50] shadow-[5px_5px_13px_#a3a3a3e6,-5px_-5px_10px_#ffffffe6] hover:shadow-[0_0_20px_rgba(44,141,176,0.3)] transition-all duration-300 [font-family:'Montserrat_Alternates',Helvetica]"
          >
            Retour à l'Accueil
          </Button>
        </Link>
      </div>
    </motion.div>
  );
};