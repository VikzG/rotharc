import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '../../../components/ui/button';
import { User, Mail, Phone, MapPin, Building } from 'lucide-react';

interface StepThreeProps {
  formData: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    postalCode: string;
    installationNotes: string;
    installationLocation: {
      name: string;
      address: string;
    };
  };
  onUpdateForm: (field: string, value: string) => void;
  onNext: () => void;
  onPrevious: () => void;
}

export const StepThree = ({
  formData,
  onUpdateForm,
  onNext,
  onPrevious
}: StepThreeProps) => {
  const [errors, setErrors] = React.useState<Record<string, string>>({});

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone: string) => {
    // Format français: +33 X XX XX XX XX ou 0X XX XX XX XX
    const phoneRegex = /^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/;
    return phoneRegex.test(phone);
  };

  const validatePostalCode = (postalCode: string) => {
    // Code postal français: 5 chiffres
    const postalCodeRegex = /^[0-9]{5}$/;
    return postalCodeRegex.test(postalCode);
  };

  const handleInputChange = (field: string, value: string) => {
    onUpdateForm(field, value);
    
    // Validation en temps réel
    const newErrors = { ...errors };
    
    switch (field) {
      case 'email':
        if (!validateEmail(value)) {
          newErrors.email = 'Adresse email invalide';
        } else {
          delete newErrors.email;
        }
        break;
      case 'phone':
        if (!validatePhone(value)) {
          newErrors.phone = 'Numéro de téléphone invalide (format: 06 12 34 56 78)';
        } else {
          delete newErrors.phone;
        }
        break;
      case 'postalCode':
        if (!validatePostalCode(value)) {
          newErrors.postalCode = 'Code postal invalide (5 chiffres)';
        } else {
          delete newErrors.postalCode;
        }
        break;
      default:
        if (!value.trim()) {
          newErrors[field] = 'Ce champ est requis';
        } else {
          delete newErrors[field];
        }
    }

    setErrors(newErrors);
  };

  const isFormValid = () => {
    const requiredFields = [
      'firstName',
      'lastName',
      'email',
      'phone',
      'address',
      'city',
      'postalCode'
    ];

    const newErrors: Record<string, string> = {};
    
    requiredFields.forEach(field => {
      const value = formData[field as keyof typeof formData];
      if (!value || (typeof value === 'string' && !value.trim())) {
        newErrors[field] = 'Ce champ est requis';
      }
    });

    if (formData.email && !validateEmail(formData.email)) {
      newErrors.email = 'Adresse email invalide';
    }
    if (formData.phone && !validatePhone(formData.phone)) {
      newErrors.phone = 'Numéro de téléphone invalide';
    }
    if (formData.postalCode && !validatePostalCode(formData.postalCode)) {
      newErrors.postalCode = 'Code postal invalide';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (isFormValid()) {
      onNext();
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-medium text-[#2C3E50] mb-8 [font-family:'Montserrat_Alternates',Helvetica]">
        Vos Informations Personnelles
      </h2>

      <div className="space-y-6">
        {/* Nom et Prénom */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm text-[#2C3E50] [font-family:'Montserrat_Alternates',Helvetica]">
              Prénom
            </label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2">
                <User className="w-5 h-5 text-[#2C3E50]" />
              </div>
              <input
                type="text"
                value={formData.firstName}
                onChange={(e) => handleInputChange('firstName', e.target.value)}
                className={`w-full pl-12 pr-4 py-3 bg-[#d9d9d9] rounded-[15px] text-[#2C3E50] placeholder-[#2C3E50]/50 shadow-[inset_5px_5px_13px_#a3a3a3e6,inset_-5px_-5px_10px_#ffffffe6] focus:outline-none [font-family:'Montserrat_Alternates',Helvetica] ${
                  errors.firstName ? 'border-2 border-red-500' : ''
                }`}
                placeholder="John"
              />
              {errors.firstName && (
                <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm text-[#2C3E50] [font-family:'Montserrat_Alternates',Helvetica]">
              Nom
            </label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2">
                <User className="w-5 h-5 text-[#2C3E50]" />
              </div>
              <input
                type="text"
                value={formData.lastName}
                onChange={(e) => handleInputChange('lastName', e.target.value)}
                className={`w-full pl-12 pr-4 py-3 bg-[#d9d9d9] rounded-[15px] text-[#2C3E50] placeholder-[#2C3E50]/50 shadow-[inset_5px_5px_13px_#a3a3a3e6,inset_-5px_-5px_10px_#ffffffe6] focus:outline-none [font-family:'Montserrat_Alternates',Helvetica] ${
                  errors.lastName ? 'border-2 border-red-500' : ''
                }`}
                placeholder="Doe"
              />
              {errors.lastName && (
                <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>
              )}
            </div>
          </div>
        </div>

        {/* Email et Téléphone */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm text-[#2C3E50] [font-family:'Montserrat_Alternates',Helvetica]">
              Email
            </label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2">
                <Mail className="w-5 h-5 text-[#2C3E50]" />
              </div>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className={`w-full pl-12 pr-4 py-3 bg-[#d9d9d9] rounded-[15px] text-[#2C3E50] placeholder-[#2C3E50]/50 shadow-[inset_5px_5px_13px_#a3a3a3e6,inset_-5px_-5px_10px_#ffffffe6] focus:outline-none [font-family:'Montserrat_Alternates',Helvetica] ${
                  errors.email ? 'border-2 border-red-500' : ''
                }`}
                placeholder="john.doe@example.com"
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm text-[#2C3E50] [font-family:'Montserrat_Alternates',Helvetica]">
              Téléphone
            </label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2">
                <Phone className="w-5 h-5 text-[#2C3E50]" />
              </div>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className={`w-full pl-12 pr-4 py-3 bg-[#d9d9d9] rounded-[15px] text-[#2C3E50] placeholder-[#2C3E50]/50 shadow-[inset_5px_5px_13px_#a3a3a3e6,inset_-5px_-5px_10px_#ffffffe6] focus:outline-none [font-family:'Montserrat_Alternates',Helvetica] ${
                  errors.phone ? 'border-2 border-red-500' : ''
                }`}
                placeholder="06 12 34 56 78"
              />
              {errors.phone && (
                <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
              )}
            </div>
          </div>
        </div>

        {/* Adresse */}
        <div className="space-y-2">
          <label className="text-sm text-[#2C3E50] [font-family:'Montserrat_Alternates',Helvetica]">
            Adresse
          </label>
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2">
              <MapPin className="w-5 h-5 text-[#2C3E50]" />
            </div>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
              className={`w-full pl-12 pr-4 py-3 bg-[#d9d9d9] rounded-[15px] text-[#2C3E50] placeholder-[#2C3E50]/50 shadow-[inset_5px_5px_13px_#a3a3a3e6,inset_-5px_-5px_10px_#ffffffe6] focus:outline-none [font-family:'Montserrat_Alternates',Helvetica] ${
                errors.address ? 'border-2 border-red-500' : ''
              }`}
              placeholder="123 rue de la Paix"
            />
            {errors.address && (
              <p className="text-red-500 text-xs mt-1">{errors.address}</p>
            )}
          </div>
        </div>

        {/* Ville et Code Postal */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm text-[#2C3E50] [font-family:'Montserrat_Alternates',Helvetica]">
              Ville
            </label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2">
                <MapPin className="w-5 h-5 text-[#2C3E50]" />
              </div>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => handleInputChange('city', e.target.value)}
                className={`w-full pl-12 pr-4 py-3 bg-[#d9d9d9] rounded-[15px] text-[#2C3E50] placeholder-[#2C3E50]/50 shadow-[inset_5px_5px_13px_#a3a3a3e6,inset_-5px_-5px_10px_#ffffffe6] focus:outline-none [font-family:'Montserrat_Alternates',Helvetica] ${
                  errors.city ? 'border-2 border-red-500' : ''
                }`}
                placeholder="Paris"
              />
              {errors.city && (
                <p className="text-red-500 text-xs mt-1">{errors.city}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm text-[#2C3E50] [font-family:'Montserrat_Alternates',Helvetica]">
              Code Postal
            </label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2">
                <MapPin className="w-5 h-5 text-[#2C3E50]" />
              </div>
              <input
                type="text"
                value={formData.postalCode}
                onChange={(e) => handleInputChange('postalCode', e.target.value)}
                className={`w-full pl-12 pr-4 py-3 bg-[#d9d9d9] rounded-[15px] text-[#2C3E50] placeholder-[#2C3E50]/50 shadow-[inset_5px_5px_13px_#a3a3a3e6,inset_-5px_-5px_10px_#ffffffe6] focus:outline-none [font-family:'Montserrat_Alternates',Helvetica] ${
                  errors.postalCode ? 'border-2 border-red-500' : ''
                }`}
                placeholder="75001"
                maxLength={5}
              />
              {errors.postalCode && (
                <p className="text-red-500 text-xs mt-1">{errors.postalCode}</p>
              )}
            </div>
          </div>
        </div>

        {/* Lieu d'Installation */}
        <div className="mt-8">
          <h3 className="text-lg font-medium text-[#2C3E50] mb-4 [font-family:'Montserrat_Alternates',Helvetica]">
            Lieu d'Installation
          </h3>
          
          <div className="bg-[#d9d9d9] rounded-[15px] p-6 shadow-[inset_5px_5px_13px_#a3a3a3e6,inset_-5px_-5px_10px_#ffffffe6]">
            <div className="flex items-center gap-3 mb-4">
              <Building className="w-6 h-6 text-[#2C8DB0]" />
              <div>
                <h4 className="text-lg font-medium text-[#2C3E50] [font-family:'Montserrat_Alternates',Helvetica]">
                  Centre Rotharc
                </h4>
                <p className="text-[#443f3f] [font-family:'Montserrat_Alternates',Helvetica]">
                  72 Rue du Futur, Paris 75001
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 space-y-2">
            <label className="text-sm text-[#2C3E50] [font-family:'Montserrat_Alternates',Helvetica]">
              Notes d'Installation (optionnel)
            </label>
            <textarea
              value={formData.installationNotes}
              onChange={(e) => handleInputChange('installationNotes', e.target.value)}
              className="w-full px-4 py-3 bg-[#d9d9d9] rounded-[15px] text-[#2C3E50] placeholder-[#2C3E50]/50 shadow-[inset_5px_5px_13px_#a3a3a3e6,inset_-5px_-5px_10px_#ffffffe6] focus:outline-none [font-family:'Montserrat_Alternates',Helvetica] min-h-[100px]"
              placeholder="Informations supplémentaires pour l'installation..."
            />
          </div>
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
          onClick={handleNext}
          className="px-8 py-2 bg-[#2C8DB0] text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#2C8DB0]/90 shadow-[0_0_20px_rgba(44,141,176,0.3)] transition-all duration-300 [font-family:'Montserrat_Alternates',Helvetica]"
        >
          Continuer
        </Button>
      </div>
    </div>
  );
};