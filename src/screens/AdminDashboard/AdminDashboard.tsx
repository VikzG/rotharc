import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Navigation } from '../../components/Navigation';
import { Footer } from '../../components/Footer';
import { Button } from '../../components/ui/button';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { toast } from 'react-hot-toast';
import { Ban, UserX, CheckCircle, Users, Wifi, WifiOff } from 'lucide-react';

export const AdminDashboard = () => {
  const { user } = useAuth();
  const [isNavVisible, setIsNavVisible] = useState(true);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!user) return;

      const { data, error } = await supabase
        .from('admin_users')
        .select('is_super_admin')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('Error checking admin status:', error);
        return;
      }

      setIsAdmin(!!data?.is_super_admin);
    };

    checkAdminStatus();
  }, [user]);

  useEffect(() => {
    const fetchUsers = async () => {
      if (!isAdmin) return;

      try {
        const session = await supabase.auth.getSession();
        const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/list-all-users`, {
          headers: {
            'Authorization': `Bearer ${session.data.session?.access_token}`,
          },
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.message || 'Failed to fetch users');
        }

        const users = await response.json();
        setUsers(users);
      } catch (error) {
        console.error('Error fetching users:', error);
        toast.error('Failed to fetch users');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();

    // Set up real-time subscription for online status
    const presence = supabase.channel('online-users')
      .on('presence', { event: 'sync' }, () => {
        fetchUsers();
      })
      .subscribe();

    return () => {
      presence.unsubscribe();
    };
  }, [isAdmin]);

  const handleBanUser = async (userId: string) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ban-user`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId }),
      });

      if (!response.ok) {
        throw new Error('Failed to ban user');
      }

      toast.success('User banned successfully');
      // Refresh user list by calling fetchUsers again
      const session = await supabase.auth.getSession();
      const usersResponse = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/list-all-users`, {
        headers: {
          'Authorization': `Bearer ${session.data.session?.access_token}`,
        },
      });
      
      if (usersResponse.ok) {
        const updatedUsers = await usersResponse.json();
        setUsers(updatedUsers);
      }
    } catch (error) {
      console.error('Error banning user:', error);
      toast.error('Failed to ban user');
    }
  };

  const handleUnbanUser = async (userId: string) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/unban-user`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId }),
      });

      if (!response.ok) {
        throw new Error('Failed to unban user');
      }

      toast.success('User unbanned successfully');
      // Refresh user list by calling fetchUsers again
      const session = await supabase.auth.getSession();
      const usersResponse = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/list-all-users`, {
        headers: {
          'Authorization': `Bearer ${session.data.session?.access_token}`,
        },
      });
      
      if (usersResponse.ok) {
        const updatedUsers = await usersResponse.json();
        setUsers(updatedUsers);
      }
    } catch (error) {
      console.error('Error unbanning user:', error);
      toast.error('Failed to unban user');
    }
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/delete-user`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId }),
      });

      if (!response.ok) {
        throw new Error('Failed to delete user');
      }

      toast.success('User deleted successfully');
      setUsers(users.filter(u => u.id !== userId));
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error('Failed to delete user');
    }
  };

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-[#d9d9d9] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-[#2C3E50] mb-4">
            Access Denied
          </h1>
          <p className="text-[#443f3f]">
            You don't have permission to access this page.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#d9d9d9]">
      <Navigation isNavVisible={isNavVisible} toggleNav={() => setIsNavVisible(!isNavVisible)} />

      <main className="pt-32 px-8 max-w-[1368px] mx-auto mb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-4xl font-semibold mb-4 text-center">
            Admin Dashboard
          </h1>
          <p className="text-lg text-center text-[#443f3f] mb-12">
            Manage users and system settings
          </p>
        </motion.div>

        <div className="bg-[#d9d9d9] rounded-[25px] p-8 shadow-[15px_15px_38px_#989898e6,-15px_-15px_30px_#ffffffe6]">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-[#2C3E50] flex items-center gap-2">
              <Users className="w-6 h-6" />
              User Management
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#2C3E50]/20">
                  <th className="text-left py-4 px-4">User</th>
                  <th className="text-left py-4 px-4">Email</th>
                  <th className="text-left py-4 px-4">Role</th>
                  <th className="text-left py-4 px-4">Status</th>
                  <th className="text-left py-4 px-4">Online</th>
                  <th className="text-right py-4 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-b border-[#2C3E50]/10">
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        {user.avatar_url ? (
                          <img
                            src={user.avatar_url}
                            alt={`${user.first_name} ${user.last_name}`}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-[#2C8DB0] flex items-center justify-center text-white">
                            {user.first_name?.[0]}
                          </div>
                        )}
                        <div>
                          <p className="font-medium text-[#2C3E50]">
                            {user.first_name} {user.last_name}
                          </p>
                          <p className="text-sm text-[#443f3f]">
                            Last sign in: {user.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleString() : 'Never'}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-[#443f3f]">{user.email}</td>
                    <td className="py-4 px-4">
                      <span className={`px-2 py-1 rounded-full text-sm ${
                        user.admin_users?.is_super_admin
                          ? 'bg-[#2C8DB0]/20 text-[#2C8DB0]'
                          : 'bg-[#2C3E50]/20 text-[#2C3E50]'
                      }`}>
                        {user.admin_users?.is_super_admin ? 'Admin' : 'User'}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`px-2 py-1 rounded-full text-sm ${
                        user.banned
                          ? 'bg-red-100 text-red-500'
                          : 'bg-green-100 text-green-500'
                      }`}>
                        {user.banned ? 'Banned' : 'Active'}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      {user.is_online ? (
                        <Wifi className="w-5 h-5 text-green-500" />
                      ) : (
                        <WifiOff className="w-5 h-5 text-gray-400" />
                      )}
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex justify-end gap-2">
                        {user.banned ? (
                          <Button
                            onClick={() => handleUnbanUser(user.id)}
                            className="bg-green-500 text-white hover:bg-green-600"
                          >
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Unban
                          </Button>
                        ) : (
                          <Button
                            onClick={() => handleBanUser(user.id)}
                            className="bg-[#2C3E50] text-white hover:bg-[#2C3E50]/80"
                          >
                            <Ban className="w-4 h-4 mr-2" />
                            Ban
                          </Button>
                        )}
                        <Button
                          onClick={() => handleDeleteUser(user.id)}
                          className="bg-red-500 text-white hover:bg-red-600"
                        >
                          <UserX className="w-4 h-4 mr-2" />
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};