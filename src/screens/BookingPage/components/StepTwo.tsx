import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '../../../components/ui/button';
import { Calendar as CalendarIcon, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { getProductById } from '../../../data/products';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';

interface StepTwoProps {
  selectedDate: Date | undefined;
  selectedTime: string | null;
  selectedProductId: string | null;
  onSelectDate: (date: Date | undefined) => void;
  onSelectTime: (time: string) => void;
  onNext: () => void;
  onPrevious: () => void;
}

const timeSlots = [
  '09:00', '10:30', '12:00',
  '14:00', '15:30', '17:00'
];

const disabledDays = [
  { before: new Date() },
  { dayOfWeek: [0, 6] }, // Dimanche (0) et Samedi (6)
];

export const StepTwo = ({ 
  selectedDate, 
  selectedTime,
  selectedProductId,
  onSelectDate, 
  onSelectTime,
  onNext,
  onPrevious
}: StepTwoProps) => {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const selectedProduct = selectedProductId ? getProductById(selectedProductId) : null;

  if (!selectedProduct) {
    return null;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-medium text-[#2C3E50] mb-8 [font-family:'Montserrat_Alternates',Helvetica]">
        Choisissez une Date et un Horaire
      </h2>

      <div className="space-y-6">
        {/* Date Input */}
        <div className="space-y-2">
          <label className="text-sm text-[#2C3E50] [font-family:'Montserrat_Alternates',Helvetica]">
            Date d'installation
          </label>
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2">
              <CalendarIcon className="w-5 h-5 text-[#2C3E50]" />
            </div>
            <input
              type="text"
              value={selectedDate ? format(selectedDate, 'dd/MM/yyyy', { locale: fr }) : ''}
              placeholder="jj/mm/aaaa"
              className="w-full pl-12 pr-4 py-3 bg-[#d9d9d9] rounded-[15px] text-[#2C3E50] placeholder-[#2C3E50]/50 shadow-[inset_5px_5px_13px_#a3a3a3e6,inset_-5px_-5px_10px_#ffffffe6] focus:outline-none [font-family:'Montserrat_Alternates',Helvetica] cursor-pointer"
              readOnly
              onClick={() => setIsCalendarOpen(!isCalendarOpen)}
            />
            {isCalendarOpen && (
              <div className="absolute z-10 mt-2 bg-[#d9d9d9] rounded-[15px] p-4 shadow-[15px_15px_38px_#989898e6,-15px_-15px_30px_#ffffffe6]">
                <DayPicker
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => {
                    onSelectDate(date);
                    setIsCalendarOpen(false);
                  }}
                  disabled={disabledDays}
                  locale={fr}
                  modifiers={{
                    selected: selectedDate,
                  }}
                  modifiersStyles={{
                    selected: {
                      backgroundColor: '#2C8DB0',
                      color: 'white',
                    },
                  }}
                  styles={{
                    caption: { color: '#2C3E50' },
                    head: { color: '#2C3E50' },
                    day: { color: '#2C3E50' },
                    nav: { color: '#2C3E50' },
                  }}
                />
              </div>
            )}
          </div>
        </div>

        {/* Time Slots */}
        <div className="space-y-2">
          <label className="text-sm text-[#2C3E50] [font-family:'Montserrat_Alternates',Helvetica]">
            Horaire Disponible
          </label>
          <div className="grid grid-cols-3 gap-4">
            {timeSlots.map((time) => (
              <motion.button
                key={time}
                whileHover={{ scale: 1.02 }}
                onClick={() => onSelectTime(time)}
                className={`relative py-3 rounded-[15px] text-center transition-all duration-300
                  ${selectedTime === time
                    ? 'bg-[#d9d9d9] text-[#2C3E50] shadow-[inset_5px_5px_13px_#a3a3a3e6,inset_-5px_-5px_10px_#ffffffe6]'
                    : 'bg-[#d9d9d9] text-[#2C3E50] shadow-[5px_5px_13px_#a3a3a3e6,-5px_-5px_10px_#ffffffe6]'
                  } [font-family:'Montserrat_Alternates',Helvetica]`}
              >
                <div className="flex items-center justify-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>{time}</span>
                </div>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Summary */}
        <div className="mt-8 space-y-2">
          <h3 className="text-lg font-medium text-[#2C3E50] [font-family:'Montserrat_Alternates',Helvetica]">
            Récapitulatif
          </h3>
          <div className="bg-[#d9d9d9] rounded-[15px] p-4 shadow-[inset_5px_5px_13px_#a3a3a3e6,inset_-5px_-5px_10px_#ffffffe6]">
            <div className="space-y-2">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium text-[#2C3E50] [font-family:'Montserrat_Alternates',Helvetica]">
                    {selectedProduct.name}
                  </p>
                  <p className="text-sm text-[#443f3f] [font-family:'Montserrat_Alternates',Helvetica]">
                    {selectedDate && selectedTime 
                      ? `${format(selectedDate, 'EEEE dd MMMM yyyy', { locale: fr })} à ${selectedTime}`
                      : 'Date et heure à sélectionner'
                    }
                  </p>
                </div>
                <p className="text-xl font-semibold text-[#2C8DB0] [font-family:'Montserrat_Alternates',Helvetica]">
                  {selectedProduct.price.toLocaleString()} €
                </p>
              </div>
            </div>
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
          disabled={!selectedDate || !selectedTime}
          onClick={onNext}
          className="px-8 py-2 bg-[#2C8DB0] text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#2C8DB0]/90 shadow-[0_0_20px_rgba(44,141,176,0.3)] transition-all duration-300 [font-family:'Montserrat_Alternates',Helvetica]"
        >
          Continuer
        </Button>
      </div>
    </div>
  );
};