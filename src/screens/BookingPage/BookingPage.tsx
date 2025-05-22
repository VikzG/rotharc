import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Navigation } from '../../components/Navigation';
import { Footer } from '../../components/Footer';
import { StepOne } from './components/StepOne';
import { StepTwo } from './components/StepTwo';
import { StepThree } from './components/StepThree';
import { StepFour } from './components/StepFour';
import { StepFive } from './components/StepFive';
import { Loader2 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/button';

export const BookingPage = () => {
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [isNavVisible, setIsNavVisible] = useState(true);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    installationNotes: '',
    installationLocation: {
      name: '',
      address: ''
    }
  });

  const totalSteps = 5;

  const handleProductSelect = (productId: string) => {
    setSelectedProduct(productId);
  };

  const handleNext = async () => {
    if (currentStep === 4) {
      setIsProcessingPayment(true);
      // Simuler un délai de traitement du paiement
      await new Promise(resolve => setTimeout(resolve, 2000));
      setIsProcessingPayment(false);
    }
    setCurrentStep(prev => prev + 1);
  };

  const handlePrevious = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handleUpdateForm = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleUpdateInstallationLocation = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      installationLocation: {
        ...prev.installationLocation,
        [field]: value
      }
    }));
  };

  const handleReset = () => {
    setCurrentStep(1);
    setSelectedProduct(null);
    setSelectedDate(undefined);
    setSelectedTime(null);
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      postalCode: '',
      installationNotes: '',
      installationLocation: {
        name: '',
        address: ''
      }
    });
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-[#d9d9d9] flex items-center justify-center px-4">
        <div className="bg-[#d9d9d9] rounded-[25px] p-8 shadow-[15px_15px_38px_#989898e6,-15px_-15px_30px_#ffffffe6] max-w-md w-full text-center">
          <h2 className="text-2xl font-semibold mb-4 [font-family:'Montserrat_Alternates',Helvetica]">
            Connexion Requise
          </h2>
          <p className="text-[#443f3f] mb-8 [font-family:'Montserrat_Alternates',Helvetica]">
            Pour accéder à la réservation, veuillez vous connecter ou créer un compte.
          </p>
          <div className="space-y-4">
            <Link to="/login">
              <Button className="w-full bg-[#2C8DB0] text-white hover:bg-[#2C8DB0]/90 shadow-[0_0_20px_rgba(44,141,176,0.3)] transition-all duration-300 [font-family:'Montserrat_Alternates',Helvetica]">
                Se connecter
              </Button>
            </Link>
            <Link to="/register">
              <Button className="w-full bg-[#d9d9d9] text-[#2C3E50] shadow-[5px_5px_13px_#a3a3a3e6,-5px_-5px_10px_#ffffffe6] hover:shadow-[0_0_20px_rgba(44,141,176,0.3)] transition-all duration-300 [font-family:'Montserrat_Alternates',Helvetica]">
                Créer un compte
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const renderStep = () => {
    if (isProcessingPayment) {
      return (
        <div className="flex flex-col items-center justify-center py-12">
          <Loader2 className="w-12 h-12 text-[#2C8DB0] animate-spin mb-4" />
          <h3 className="text-xl font-medium text-[#2C3E50] mb-2 [font-family:'Montserrat_Alternates',Helvetica]">
            Traitement du paiement en cours
          </h3>
          <p className="text-[#443f3f] [font-family:'Montserrat_Alternates',Helvetica]">
            Veuillez patienter pendant que nous traitons votre paiement...
          </p>
        </div>
      );
    }

    switch (currentStep) {
      case 1:
        return (
          <StepOne 
            selectedProduct={selectedProduct} 
            onSelectProduct={handleProductSelect}
            onNext={handleNext}
          />
        );
      case 2:
        return (
          <StepTwo
            selectedDate={selectedDate}
            selectedTime={selectedTime}
            selectedProductId={selectedProduct}
            onSelectDate={setSelectedDate}
            onSelectTime={setSelectedTime}
            onNext={handleNext}
            onPrevious={handlePrevious}
          />
        );
      case 3:
        return (
          <StepThree
            formData={formData}
            onUpdateForm={handleUpdateForm}
            onUpdateInstallationLocation={handleUpdateInstallationLocation}
            onNext={handleNext}
            onPrevious={handlePrevious}
          />
        );
      case 4:
        return (
          <StepFour
            selectedProductId={selectedProduct}
            selectedDate={selectedDate}
            selectedTime={selectedTime}
            onNext={handleNext}
            onPrevious={handlePrevious}
          />
        );
      case 5:
        return (
          <StepFive
            selectedProductId={selectedProduct}
            selectedDate={selectedDate}
            selectedTime={selectedTime}
            formData={formData}
            onReset={handleReset}
          />
        );
      default:
        return null;
    }
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
            Réservation d'installation
          </h1>
          <p className="text-lg text-center text-[#443f3f] mb-12 [font-family:'Montserrat_Alternates',Helvetica]">
            Suivez les étapes pour planifier votre transformation
          </p>
        </motion.div>

        {/* Progress Bar */}
        <div className="w-full max-w-[800px] mx-auto mb-12">
          <div className="relative">
            <div className="h-2 bg-[#d9d9d9] rounded-full shadow-[inset_3px_3px_6px_#989898,inset_-3px_-3px_6px_#ffffff]">
              <motion.div
                className="absolute h-2 bg-[#2C8DB0] rounded-full"
                initial={{ width: '0%' }}
                animate={{ width: `${(currentStep / totalSteps) * 100}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
            <div className="flex justify-between mt-4">
              {Array.from({ length: totalSteps }).map((_, index) => (
                <div
                  key={index}
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
                    ${index + 1 <= currentStep
                      ? 'bg-[#2C8DB0] text-white'
                      : 'bg-[#d9d9d9] text-[#2C3E50] shadow-[3px_3px_6px_#989898,-3px_-3px_6px_#ffffff]'
                    }`}
                >
                  {index + 1}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Content Container */}
        <div className="w-full max-w-[800px] mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.5 }}
              className="bg-[#d9d9d9] rounded-[25px] p-8 shadow-[15px_15px_38px_#989898e6,-15px_-15px_30px_#ffffffe6,15px_-15px_30px_#98989833,-15px_15px_30px_#98989833]"
            >
              {renderStep()}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      <Footer />
    </div>
  );
};