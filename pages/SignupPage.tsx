
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Lock, Mail, User as UserIcon, AlertCircle, ArrowLeft, Scissors, ShoppingBag, User, Sparkles } from 'lucide-react';
import { UserRole } from '../types';

export const SignupPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>(UserRole.CUSTOMER);
  const [error, setError] = useState('');
  
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await register(name, email, password, role);
      navigate('/profile');
    } catch (err: any) {
      setError(err.message || 'Failed to create account');
    }
  };

  const RoleCard = ({ r, icon: Icon, label, desc }: { r: UserRole, icon: any, label: string, desc: string }) => (
    <div 
      onClick={() => setRole(r)}
      className={`p-3 rounded-xl border cursor-pointer transition-all flex flex-col items-center text-center gap-2 ${role === r ? 'border-primary-600 bg-primary-50 ring-1 ring-primary-600' : 'border-gray-200 bg-white hover:border-gray-300'}`}
    >
      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${role === r ? 'bg-primary-200 text-primary-700' : 'bg-gray-100 text-gray-500'}`}>
         <Icon size={20} />
      </div>
      <div>
         <p className={`text-xs font-bold ${role === r ? 'text-primary-900' : 'text-gray-900'}`}>{label}</p>
         <p className="text-[10px] text-gray-500 leading-tight mt-0.5">{desc}</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl overflow-hidden">
        <div className="bg-gray-900 px-8 py-10 relative">
           <button 
             onClick={() => navigate('/')} 
             className="absolute top-6 left-6 text-white/80 hover:text-white transition-colors"
           >
             <ArrowLeft size={24} />
           </button>
          <h2 className="text-3xl font-bold text-white mb-2 font-heading">Join GlowHub</h2>
          <p className="text-gray-400">Create your account to get started.</p>
        </div>
        
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-xl flex items-center gap-2 text-sm">
              <AlertCircle size={16} /> {error}
            </div>
          )}

          <div>
             <label className="block text-xs font-bold text-gray-500 uppercase mb-3 ml-1 tracking-wider">I want to...</label>
             <div className="grid grid-cols-2 gap-2">
                <RoleCard r={UserRole.CUSTOMER} icon={User} label="Book" desc="Find services" />
                <RoleCard r={UserRole.BARBER} icon={Scissors} label="Barber Shop" desc="Manage Shop" />
                <RoleCard r={UserRole.SALON_OWNER} icon={Sparkles} label="Salon Owner" desc="Manage Salon" />
                <RoleCard r={UserRole.SELLER} icon={ShoppingBag} label="Seller" desc="List Products" />
             </div>
          </div>
          
          <div className="space-y-4">
             <div>
               <label className="block text-xs font-bold text-gray-500 uppercase mb-1 ml-1">Full Name</label>
               <div className="relative">
                  <UserIcon className="absolute left-4 top-3.5 text-gray-400" size={18} />
                  <input 
                    type="text" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-11 pr-4 py-3 text-sm focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                    placeholder="John Doe"
                    required
                  />
               </div>
            </div>
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
                    placeholder="Create a strong password"
                    required
                  />
               </div>
            </div>
          </div>

          <button 
            type="submit" 
            className="w-full bg-primary-600 text-white font-bold py-3.5 rounded-xl shadow-lg hover:bg-primary-700 transition-all active:scale-95"
          >
            Create Account
          </button>
          
          <div className="text-center">
             <p className="text-sm text-gray-600">
               Already have an account? <button type="button" onClick={() => navigate('/login')} className="text-primary-600 font-bold hover:underline">Sign In</button>
             </p>
          </div>
        </form>
      </div>
    </div>
  );
};
