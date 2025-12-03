
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { UserRole } from '../types';

export const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading) {
      if (currentUser?.role === UserRole.BARBER) {
        navigate('/dashboard/barber', { replace: true });
      } else if (currentUser?.role === UserRole.SALON_OWNER) {
        navigate('/dashboard/salon', { replace: true });
      } else if (currentUser?.role === UserRole.ADMIN) {
        navigate('/admin', { replace: true });
      } else {
        navigate('/dashboard/user', { replace: true });
      }
    }
  }, [currentUser, isLoading, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
       <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
    </div>
  );
};
