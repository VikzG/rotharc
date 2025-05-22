import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { signOut } from '../lib/auth';
import { UserIcon, LogOutIcon, CalendarIcon } from 'lucide-react';

interface UserMenuProps {
  onClose: () => void;
}

export const UserMenu = ({ onClose }: UserMenuProps) => {
  const { profile } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="absolute right-0 top-full mt-2 w-48 rounded-lg bg-[#d9d9d9] shadow-lg py-2"
    >
      <div className="px-4 py-2 border-b border-[#2C3E50]/10">
        <p className="text-sm font-medium text-[#2C3E50] [font-family:'Montserrat_Alternates',Helvetica]">
          {profile?.first_name} {profile?.last_name}
        </p>
      </div>
      
      <div className="py-1">
        <Link
          to="/profile"
          className="flex items-center px-4 py-2 text-sm text-[#2C3E50] hover:bg-[#2C8DB0]/10 [font-family:'Montserrat_Alternates',Helvetica]"
          onClick={onClose}
        >
          <UserIcon className="w-4 h-4 mr-2" />
          Mon Profil
        </Link>
        
        <Link
          to="/mes-reservations"
          className="flex items-center px-4 py-2 text-sm text-[#2C3E50] hover:bg-[#2C8DB0]/10 [font-family:'Montserrat_Alternates',Helvetica]"
          onClick={onClose}
        >
          <CalendarIcon className="w-4 h-4 mr-2" />
          Mes Réservations
        </Link>
        
        <button
          onClick={handleSignOut}
          className="flex items-center w-full px-4 py-2 text-sm text-[#2C3E50] hover:bg-[#2C8DB0]/10 [font-family:'Montserrat_Alternates',Helvetica]"
        >
          <LogOutIcon className="w-4 h-4 mr-2" />
          Déconnexion
        </button>
      </div>
    </motion.div>
  );
};