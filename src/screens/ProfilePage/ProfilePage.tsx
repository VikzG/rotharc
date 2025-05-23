import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Navigation } from '../../components/Navigation';
import { Footer } from '../../components/Footer';
import { Button } from '../../components/ui/button';
import { useAuth } from '../../contexts/AuthContext';
import { UserCircle, Mail, Phone, MapPin, Building, Trash2, Camera } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { toast } from 'react-hot-toast';
import { deleteAccount } from '../../lib/auth';
import { useNavigate } from 'react-router-dom';

export const ProfilePage = () => {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [isNavVisible, setIsNavVisible] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    avatarUrl: '',
  });

  useEffect(() => {
    if (profile && user) {
      setFormData({
        firstName: profile.first_name || '',
        lastName: profile.last_name || '',
        email: user.email || '',
        phone: profile.phone || '',
        address: profile.address || '',
        city: profile.city || '',
        postalCode: profile.postal_code || '',
        avatarUrl: profile.avatar_url || '',
      });
    }
  }, [profile, user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          first_name: formData.firstName,
          last_name: formData.lastName,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          postal_code: formData.postalCode,
          avatar_url: formData.avatarUrl,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user?.id);

      if (error) throw error;

      toast.success('Profil mis à jour avec succès !');
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Erreur lors de la mise à jour du profil');
    }
  };

  const handleDeleteAccount = async () => {
    const result = await deleteAccount();
    if (result.success) {
      navigate('/');
    }
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      // Vérifier si le bucket existe, sinon le créer
      const { data: buckets } = await supabase.storage.listBuckets();
      const avatarBucket = buckets?.find(b => b.name === 'avatars');
      
      if (!avatarBucket) {
        const { error: bucketError } = await supabase.storage.createBucket('avatars', {
          public: true,
          fileSizeLimit: 1024 * 1024, // 1MB
          allowedMimeTypes: ['image/jpeg', 'image/png', 'image/gif']
        });
        
        if (bucketError) {
          console.error('Error creating bucket:', bucketError);
          throw new Error('Erreur lors de la création du bucket de stockage');
        }
      }

      // Générer un nom de fichier unique
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `${user?.id}/${fileName}`;

      // Upload du fichier
      const { error: uploadError, data } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true
        });

      if (uploadError) {
        console.error('Error uploading file:', uploadError);
        throw new Error('Erreur lors du téléchargement du fichier');
      }

      // Récupérer l'URL publique
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      // Mettre à jour le profil avec la nouvelle URL
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ 
          avatar_url: publicUrl,
          updated_at: new Date().toISOString()
        })
        .eq('id', user?.id);

      if (updateError) {
        console.error('Error updating profile:', updateError);
        throw new Error('Erreur lors de la mise à jour du profil');
      }

      setFormData(prev => ({ ...prev, avatarUrl: publicUrl }));
      toast.success('Avatar mis à jour avec succès !');
    } catch (error) {
      console.error('Error handling avatar:', error);
      toast.error(error instanceof Error ? error.message : 'Erreur lors de la mise à jour de l\'avatar');
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
          <div className="flex flex-col items-center mb-8">
            <div className="relative">
              <div className="w-32 h-32 rounded-full overflow-hidden bg-[#d9d9d9] shadow-[5px_5px_13px_#a3a3a3e6,-5px_-5px_10px_#ffffffe6]">
                {formData.avatarUrl ? (
                  <img
                    src={formData.avatarUrl}
                    alt="Avatar"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <UserCircle className="w-20 h-20 text-[#2C3E50]" />
                  </div>
                )}
              </div>
              <label className="absolute bottom-0 right-0 w-10 h-10 bg-[#2C8DB0] rounded-full flex items-center justify-center cursor-pointer shadow-lg hover:bg-[#2C8DB0]/90 transition-colors">
                <Camera className="w-5 h-5 text-white" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="hidden"
                />
              </label>
            </div>
            <h1 className="text-4xl font-semibold mt-4 mb-2 [font-family:'Montserrat_Alternates',Helvetica]">
              Mon Profil
            </h1>
            <p className="text-lg text-[#443f3f] [font-family:'Montserrat_Alternates',Helvetica]">
              Gérez vos informations personnelles
            </p>
          </div>
        </motion.div>

        <div className="bg-[#d9d9d9] rounded-[25px] p-8 shadow-[15px_15px_38px_#989898e6,-15px_-15px_30px_#ffffffe6]">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-[#2C3E50] mb-2 [font-family:'Montserrat_Alternates',Helvetica]">
                  Prénom
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                    <UserCircle className="w-5 h-5 text-[#2C3E50]" />
                  </div>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    disabled={!isEditing}
                    className="w-full pl-10 pr-4 py-2 bg-[#d9d9d9] rounded-[15px] text-[#2C3E50] placeholder-[#2C3E50]/50 shadow-[inset_5px_5px_13px_#a3a3a3e6,inset_-5px_-5px_10px_#ffffffe6] focus:outline-none focus:ring-2 focus:ring-[#2C8DB0] disabled:opacity-50 [font-family:'Montserrat_Alternates',Helvetica]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#2C3E50] mb-2 [font-family:'Montserrat_Alternates',Helvetica]">
                  Nom
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                    <UserCircle className="w-5 h-5 text-[#2C3E50]" />
                  </div>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    disabled={!isEditing}
                    className="w-full pl-10 pr-4 py-2 bg-[#d9d9d9] rounded-[15px] text-[#2C3E50] placeholder-[#2C3E50]/50 shadow-[inset_5px_5px_13px_#a3a3a3e6,inset_-5px_-5px_10px_#ffffffe6] focus:outline-none focus:ring-2 focus:ring-[#2C8DB0] disabled:opacity-50 [font-family:'Montserrat_Alternates',Helvetica]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#2C3E50] mb-2 [font-family:'Montserrat_Alternates',Helvetica]">
                  Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                    <Mail className="w-5 h-5 text-[#2C3E50]" />
                  </div>
                  <input
                    type="email"
                    value={formData.email}
                    disabled
                    className="w-full pl-10 pr-4 py-2 bg-[#d9d9d9] rounded-[15px] text-[#2C3E50] placeholder-[#2C3E50]/50 shadow-[inset_5px_5px_13px_#a3a3a3e6,inset_-5px_-5px_10px_#ffffffe6] focus:outline-none focus:ring-2 focus:ring-[#2C8DB0] disabled:opacity-50 [font-family:'Montserrat_Alternates',Helvetica]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#2C3E50] mb-2 [font-family:'Montserrat_Alternates',Helvetica]">
                  Téléphone
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                    <Phone className="w-5 h-5 text-[#2C3E50]" />
                  </div>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    disabled={!isEditing}
                    className="w-full pl-10 pr-4 py-2 bg-[#d9d9d9] rounded-[15px] text-[#2C3E50] placeholder-[#2C3E50]/50 shadow-[inset_5px_5px_13px_#a3a3a3e6,inset_-5px_-5px_10px_#ffffffe6] focus:outline-none focus:ring-2 focus:ring-[#2C8DB0] disabled:opacity-50 [font-family:'Montserrat_Alternates',Helvetica]"
                  />
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-[#2C3E50] mb-2 [font-family:'Montserrat_Alternates',Helvetica]">
                  Adresse
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                    <MapPin className="w-5 h-5 text-[#2C3E50]" />
                  </div>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    disabled={!isEditing}
                    className="w-full pl-10 pr-4 py-2 bg-[#d9d9d9] rounded-[15px] text-[#2C3E50] placeholder-[#2C3E50]/50 shadow-[inset_5px_5px_13px_#a3a3a3e6,inset_-5px_-5px_10px_#ffffffe6] focus:outline-none focus:ring-2 focus:ring-[#2C8DB0] disabled:opacity-50 [font-family:'Montserrat_Alternates',Helvetica]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#2C3E50] mb-2 [font-family:'Montserrat_Alternates',Helvetica]">
                  Ville
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                    <Building className="w-5 h-5 text-[#2C3E50]" />
                  </div>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    disabled={!isEditing}
                    className="w-full pl-10 pr-4 py-2 bg-[#d9d9d9] rounded-[15px] text-[#2C3E50] placeholder-[#2C3E50]/50 shadow-[inset_5px_5px_13px_#a3a3a3e6,inset_-5px_-5px_10px_#ffffffe6] focus:outline-none focus:ring-2 focus:ring-[#2C8DB0] disabled:opacity-50 [font-family:'Montserrat_Alternates',Helvetica]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#2C3E50] mb-2 [font-family:'Montserrat_Alternates',Helvetica]">
                  Code Postal
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                    <MapPin className="w-5 h-5 text-[#2C3E50]" />
                  </div>
                  <input
                    type="text"
                    value={formData.postalCode}
                    onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                    disabled={!isEditing}
                    className="w-full pl-10 pr-4 py-2 bg-[#d9d9d9] rounded-[15px] text-[#2C3E50] placeholder-[#2C3E50]/50 shadow-[inset_5px_5px_13px_#a3a3a3e6,inset_-5px_-5px_10px_#ffffffe6] focus:outline-none focus:ring-2 focus:ring-[#2C8DB0] disabled:opacity-50 [font-family:'Montserrat_Alternates',Helvetica]"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center pt-6">
              <Button
                type="button"
                onClick={() => setShowDeleteConfirmation(true)}
                className="px-6 bg-red-500 text-white hover:bg-red-600 shadow-[0_0_20px_rgba(239,68,68,0.3)] transition-all duration-300 [font-family:'Montserrat_Alternates',Helvetica] flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Supprimer mon compte
              </Button>

              <div className="flex gap-4">
                {isEditing ? (
                  <>
                    <Button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="px-6 bg-[#d9d9d9] text-[#2C3E50] shadow-[5px_5px_13px_#a3a3a3e6,-5px_-5px_10px_#ffffffe6] hover:shadow-[0_0_20px_rgba(44,141,176,0.3)] transition-all duration-300 [font-family:'Montserrat_Alternates',Helvetica]"
                    >
                      Annuler
                    </Button>
                    <Button
                      type="submit"
                      className="px-6 bg-[#2C8DB0] text-white hover:bg-[#2C8DB0]/90 shadow-[0_0_20px_rgba(44,141,176,0.3)] transition-all duration-300 [font-family:'Montserrat_Alternates',Helvetica]"
                    >
                      Enregistrer
                    </Button>
                  </>
                ) : (
                  <Button
                    type="button"
                    onClick={() => setIsEditing(true)}
                    className="px-6 bg-[#2C8DB0] text-white hover:bg-[#2C8DB0]/90 shadow-[0_0_20px_rgba(44,141,176,0.3)] transition-all duration-300 [font-family:'Montserrat_Alternates',Helvetica]"
                  >
                    Modifier
                  </Button>
                )}
              </div>
            </div>
          </form>
        </div>

        {/* Delete Account Confirmation Modal */}
        {showDeleteConfirmation && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-[#d9d9d9] rounded-[25px] p-8 max-w-md w-full mx-4 shadow-[15px_15px_38px_#989898e6,-15px_-15px_30px_#ffffffe6]">
              <h3 className="text-xl font-semibold mb-4 text-[#2C3E50] [font-family:'Montserrat_Alternates',Helvetica]">
                Confirmer la suppression
              </h3>
              <p className="text-[#443f3f] mb-6 [font-family:'Montserrat_Alternates',Helvetica]">
                Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible.
              </p>
              <div className="flex justify-end gap-4">
                <Button
                  onClick={() => setShowDeleteConfirmation(false)}
                  className="px-6 bg-[#d9d9d9] text-[#2C3E50] shadow-[5px_5px_13px_#a3a3a3e6,-5px_-5px_10px_#ffffffe6] hover:shadow-[0_0_20px_rgba(44,141,176,0.3)] transition-all duration-300 [font-family:'Montserrat_Alternates',Helvetica]"
                >
                  Annuler
                </Button>
                <Button
                  onClick={handleDeleteAccount}
                  className="px-6 bg-red-500 text-white hover:bg-red-600 shadow-[0_0_20px_rgba(239,68,68,0.3)] transition-all duration-300 [font-family:'Montserrat_Alternates',Helvetica]"
                >
                  Supprimer
                </Button>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};