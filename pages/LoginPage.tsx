
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Lock, Mail, AlertCircle, ArrowLeft } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as any)?.from?.pathname || '/profile';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err: any) {
      setError(err.message || 'Failed to sign in');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl overflow-hidden">
        <div className="bg-primary-600 px-8 py-10 relative">
          <button 
             onClick={() => navigate('/')} 
             className="absolute top-6 left-6 text-white/80 hover:text-white transition-colors"
          >
             <ArrowLeft size={24} />
          </button>
          <h2 className="text-3xl font-bold text-white mb-2 font-heading">Welcome Back</h2>
          <p className="text-primary-100">Sign in to manage your appointments and style.</p>
        </div>
        
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-xl flex items-center gap-2 text-sm">
              <AlertCircle size={16} /> {error}
            </div>
          )}
          
          <div className="space-y-4">
            <div>
               <label className="block text-xs font-bold text-gray-500 uppercase mb-1 ml-1">Email Address</label>
               <div className="relative">
                  <Mail className="absolute left-4 top-3.5 text-gray-400" size={18} />
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-11 pr-4 py-3 text-sm focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                    placeholder="you@example.com"
                    required
                  />
               </div>
            </div>
            <div>
               <label className="block text-xs font-bold text-gray-500 uppercase mb-1 ml-1">Password</label>
               <div className="relative">
                  <Lock className="absolute left-4 top-3.5 text-gray-400" size={18} />
                  <input 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-11 pr-4 py-3 text-sm focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                    placeholder="••••••••"
                    required
                  />
               </div>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs">
             <label className="flex items-center gap-2 text-gray-600 cursor-pointer">
               <input type="checkbox" className="rounded text-primary-600 focus:ring-primary-500" />
               Remember me
             </label>
             <button type="button" className="text-primary-600 font-bold hover:underline">Forgot Password?</button>
          </div>

          <button 
            type="submit" 
            className="w-full bg-gray-900 text-white font-bold py-3.5 rounded-xl shadow-lg hover:bg-black transition-all active:scale-95"
          >
            Sign In
          </button>
          
          <div className="text-center">
             <p className="text-sm text-gray-600">
               Don't have an account? <button type="button" onClick={() => navigate('/signup')} className="text-primary-600 font-bold hover:underline">Sign Up</button>
             </p>
          </div>
          
          <div className="relative my-6">
             <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-100"></div></div>
             <div className="relative flex justify-center text-xs uppercase"><span className="bg-white px-2 text-gray-400">Or continue with</span></div>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
             <button type="button" className="flex items-center justify-center gap-2 bg-white border border-gray-200 py-2.5 rounded-xl text-sm font-bold text-gray-700 hover:bg-gray-50 transition-colors">
                <span className="text-lg">G</span> Google
             </button>
             <button type="button" className="flex items-center justify-center gap-2 bg-[#1877F2] py-2.5 rounded-xl text-sm font-bold text-white hover:opacity-90 transition-colors">
                <span className="text-lg">f</span> Facebook
             </button>
          </div>
        </form>
      </div>
    </div>
  );
};
