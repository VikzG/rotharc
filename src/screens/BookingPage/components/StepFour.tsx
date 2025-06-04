import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '../../../components/ui/button';
import { CreditCard, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { getProductById } from '../../../lib/products';
import { Product } from '../../../types';

interface StepFourProps {
  selectedProductId: string | null;
  selectedDate: Date | undefined;
  selectedTime: string | null;
  onNext: () => void;
  onPrevious: () => void;
}

export const StepFour = ({
  selectedProductId,
  selectedDate,
  selectedTime,
  onNext,
  onPrevious
}: StepFourProps) => {
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'crypto'>('card');
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);

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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-[#2C3E50] text-xl [font-family:'Montserrat_Alternates',Helvetica]">
          Chargement du produit...
        </p>
      </div>
    );
  }

  if (!selectedProduct || !selectedDate || !selectedTime) {
    return null;
  }

  const deposit = Math.round(selectedProduct.price * 0.3);

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-medium text-[#2C3E50] mb-8 [font-family:'Montserrat_Alternates',Helvetica]">
        Informations de Paiement
      </h2>

      {/* Payment Method Selection */}
      <div className="space-y-2 mb-8">
        <label className="text-sm text-[#2C3E50] [font-family:'Montserrat_Alternates',Helvetica]">
          Méthode de Paiement
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div
            className={`bg-[#d9d9d9] rounded-[15px] p-4 cursor-pointer transition-all duration-300 ${
              paymentMethod === 'card'
                ? 'shadow-[inset_5px_5px_13px_#a3a3a3e6,inset_-5px_-5px_10px_#ffffffe6] border-2 border-[#2C8DB0]'
                : 'shadow-[5px_5px_13px_#a3a3a3e6,-5px_-5px_10px_#ffffffe6] hover:shadow-[0_0_20px_rgba(44,141,176,0.3)]'
            }`}
            onClick={() => setPaymentMethod('card')}
          >
            <div className="flex items-center">
              <CreditCard className="h-6 w-6 text-[#2C3E50] mr-3" />
              <div>
                <h3 className="font-medium text-[#2C3E50] [font-family:'Montserrat_Alternates',Helvetica]">
                  Carte Bancaire
                </h3>
                <p className="text-sm text-[#443f3f] [font-family:'Montserrat_Alternates',Helvetica]">
                  Paiement sécurisé
                </p>
              </div>
            </div>
          </div>

          <div
            className={`bg-[#d9d9d9] rounded-[15px] p-4 cursor-pointer transition-all duration-300 ${
              paymentMethod === 'crypto'
                ? 'shadow-[inset_5px_5px_13px_#a3a3a3e6,inset_-5px_-5px_10px_#ffffffe6] border-2 border-[#2C8DB0]'
                : 'shadow-[5px_5px_13px_#a3a3a3e6,-5px_-5px_10px_#ffffffe6] hover:shadow-[0_0_20px_rgba(44,141,176,0.3)]'
            }`}
            onClick={() => setPaymentMethod('crypto')}
          >
            <div className="flex items-center">
              <svg className="h-6 w-6 text-[#2C3E50] mr-3" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 8.25H15M9 15.75H15M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <div>
                <h3 className="font-medium text-[#2C3E50] [font-family:'Montserrat_Alternates',Helvetica]">
                  Crypto-monnaie
                </h3>
                <p className="text-sm text-[#443f3f] [font-family:'Montserrat_Alternates',Helvetica]">
                  Bitcoin, Ethereum, etc.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Terms Agreement */}
      <div className="mb-8">
        <div className="flex items-start">
          <input
            type="checkbox"
            id="agreeToTerms"
            checked={agreeToTerms}
            onChange={(e) => setAgreeToTerms(e.target.checked)}
            className="mt-1 mr-3 h-4 w-4 rounded border-[#2C3E50] text-[#2C8DB0] focus:ring-[#2C8DB0]"
          />
          <label htmlFor="agreeToTerms" className="text-sm text-[#2C3E50] [font-family:'Montserrat_Alternates',Helvetica]">
            J'accepte les <a href="#" className="text-[#2C8DB0] hover:underline">conditions générales</a> et 
            la <a href="#" className="text-[#2C8DB0] hover:underline">politique de confidentialité</a>. 
            Je comprends que cette réservation nécessite un acompte de 30% non remboursable.
          </label>
        </div>
      </div>

      {/* Order Summary */}
      <div className="bg-[#d9d9d9] rounded-[15px] p-6 shadow-[inset_5px_5px_13px_#a3a3a3e6,inset_-5px_-5px_10px_#ffffffe6] mb-8">
        <h3 className="text-lg font-medium text-[#2C3E50] mb-4 [font-family:'Montserrat_Alternates',Helvetica]">
          Récapitulatif de la Commande
        </h3>
        
        <div className="space-y-4">
          <div className="flex justify-between">
            <span className="text-[#443f3f] [font-family:'Montserrat_Alternates',Helvetica]">Service:</span>
            <span className="text-[#2C3E50] [font-family:'Montserrat_Alternates',Helvetica]">{selectedProduct.name}</span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-[#443f3f] [font-family:'Montserrat_Alternates',Helvetica]">Date et heure:</span>
            <span className="text-[#2C3E50] [font-family:'Montserrat_Alternates',Helvetica]">
              {format(selectedDate, 'EEEE dd MMMM yyyy', { locale: fr })} à {selectedTime}
            </span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-[#443f3f] [font-family:'Montserrat_Alternates',Helvetica]">Prix:</span>
            <span className="text-[#2C3E50] [font-family:'Montserrat_Alternates',Helvetica]">
              {selectedProduct.price.toLocaleString()} €
            </span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-[#443f3f] [font-family:'Montserrat_Alternates',Helvetica]">Acompte (30%):</span>
            <span className="text-[#2C8DB0] font-medium [font-family:'Montserrat_Alternates',Helvetica]">
              {deposit.toLocaleString()} €
            </span>
          </div>
        </div>
        
        <div className="border-t border-[#2C3E50]/20 mt-4 pt-4 flex justify-between items-center">
          <span className="text-[#2C3E50] font-medium [font-family:'Montserrat_Alternates',Helvetica]">
            Total à payer maintenant:
          </span>
          <span className="text-xl text-[#2C8DB0] font-semibold [font-family:'Montserrat_Alternates',Helvetica]">
            {deposit.toLocaleString()} €
          </span>
        </div>
      </div>

      <div className="flex justify-between pt-6">
        <Button
          onClick={onPrevious}
          className="px-8 py-2 bg-[#d9d9d9] text-[#2C3E50] shadow-[5px_5px_13px_#a3a3a3e6,-5px_-5px_10px_#ffffffe6] hover:shadow-[0_0_20px_rgba(44,141,176,0.3)] transition-all duration-300 [font-family:'Montserrat_Alternates',Helvetica]"
        >
          Retour
        </Button>
        <Button
          disabled={!agreeToTerms}
          onClick={onNext}
          className="px-8 py-2 bg-[#2C8DB0] text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#2C8DB0]/90 shadow-[0_0_20px_rgba(44,141,176,0.3)] transition-all duration-300 [font-family:'Montserrat_Alternates',Helvetica]"
        >
          Payer {deposit.toLocaleString()} €
        </Button>
      </div>
    </div>
  );
};