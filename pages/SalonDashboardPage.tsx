
import React, { useState } from 'react';
import { Calendar, DollarSign, Sparkles, Clock, ChevronRight, TrendingUp, Power, Download, LogOut, Settings, Users, ArrowUpRight } from 'lucide-react';
import { Booking, Service } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const MOCK_SALON_BOOKINGS: Booking[] = [
  { id: 'BK-701', salonName: 'Glow Spa', serviceName: 'Hydra Facial', staffName: 'Sara', date: 'Today', time: '11:00 AM', price: 5000, paymentMethod: 'CARD', status: 'CONFIRMED' },
  { id: 'BK-702', salonName: 'Glow Spa', serviceName: 'Bridal Makeup Trial', staffName: 'Hina', date: 'Today', time: '02:00 PM', price: 15000, paymentMethod: 'CASH', status: 'CONFIRMED' },
];

const MOCK_SALON_SERVICES: Service[] = [
  { id: 's1', name: 'Hydra Facial', price: 5000, durationMin: 60, category: 'Face' },
  { id: 's2', name: 'Party Makeup', price: 8000, durationMin: 90, category: 'Makeup' },
  { id: 's3', name: 'Mani-Pedi Spa', price: 3500, durationMin: 45, category: 'Nails' },
];

export const SalonDashboardPage: React.FC = () => {
  const [isOnline, setIsOnline] = useState(true);
  const [activeTab, setActiveTab] = useState<'schedule' | 'services' | 'earnings' | 'settings'>('schedule');
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
     logout();
     navigate('/');
  };

  return (
    <div className="pt-20 pb-24 px-4 max-w-5xl mx-auto min-h-screen relative">
      
      {/* Header Status */}
      <div className="flex justify-between items-center mb-6 bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
         <div>
            <h1 className="text-xl font-bold text-gray-900">{currentUser?.name}'s Salon</h1>
            <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500">Salon Dashboard</span>
                {currentUser?.isVerified && <span className="bg-purple-100 text-purple-700 text-[10px] font-bold px-1.5 py-0.5 rounded">Verified Partner</span>}
            </div>
         </div>
         <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
                <span className={`text-xs font-bold ${isOnline ? 'text-green-600' : 'text-gray-500'}`}>{isOnline ? 'Salon Open' : 'Salon Closed'}</span>
                <button 
                onClick={() => setIsOnline(!isOnline)}
                className={`w-12 h-6 rounded-full p-1 transition-colors duration-300 ${isOnline ? 'bg-green-500' : 'bg-gray-300'}`}
                >
                <div className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform duration-300 ${isOnline ? 'translate-x-6' : 'translate-x-0'}`}></div>
                </button>
            </div>
            <button onClick={handleLogout} className="text-gray-400 hover:text-red-500 transition-colors"><LogOut size={20}/></button>
         </div>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
         
         {/* Sidebar Nav */}
         <div className="w-full md:w-64 bg-white rounded-2xl shadow-sm border border-gray-100 p-2 h-fit">
            {[
               { id: 'schedule', label: 'Schedule', icon: Calendar },
               { id: 'services', label: 'Spa Menu', icon: Sparkles },
               { id: 'earnings', label: 'Revenue', icon: DollarSign },
               { id: 'settings', label: 'Salon Settings', icon: Settings },
            ].map(tab => (
               <button
                 key={tab.id}
                 onClick={() => setActiveTab(tab.id as any)}
                 className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-colors mb-1 active:scale-95 ${
                    activeTab === tab.id ? 'bg-primary-600 text-white' : 'text-gray-600 hover:bg-gray-50'
                 }`}
               >
                  <tab.icon size={18} /> {tab.label}
               </button>
            ))}
         </div>

         {/* Content Area */}
         <div className="flex-1">
            
            {/* Schedule Tab */}
            {activeTab === 'schedule' && (
               <div className="space-y-4 animate-in fade-in">
                  <div className="flex justify-between items-center">
                     <h2 className="font-bold text-gray-900">Today's Appointments</h2>
                     <span className="text-xs font-bold bg-purple-50 text-purple-600 px-3 py-1 rounded-full">{MOCK_SALON_BOOKINGS.length} Total</span>
                  </div>
                  {MOCK_SALON_BOOKINGS.map(bk => (
                     <div key={bk.id} className="bg-white p-4 rounded-xl border-l-4 border-primary-500 shadow-sm flex justify-between items-center">
                        <div>
                           <div className="flex items-center gap-2 mb-1">
                              <span className="font-bold text-lg text-gray-900">{bk.time}</span>
                              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded font-bold uppercase">{bk.paymentMethod}</span>
                           </div>
                           <p className="font-medium text-gray-700">{bk.serviceName}</p>
                           <p className="text-xs text-gray-500">Stylist: {bk.staffName}</p>
                        </div>
                        <button className="bg-gray-100 hover:bg-gray-200 text-gray-600 px-4 py-2 rounded-lg text-xs font-bold transition-colors active:scale-95">
                           Details
                        </button>
                     </div>
                  ))}
                  <div className="bg-gray-50 border border-dashed border-gray-300 rounded-xl p-6 text-center">
                     <p className="text-gray-400 text-sm font-medium">No more bookings for today</p>
                  </div>
               </div>
            )}

            {/* Services Tab */}
            {activeTab === 'services' && (
               <div className="space-y-4 animate-in fade-in">
                  <div className="flex justify-between items-center">
                     <h2 className="font-bold text-gray-900">Spa & Salon Menu</h2>
                     <button className="bg-primary-600 text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-primary-700 transition-colors active:scale-95">
                        + Add Treatment
                     </button>
                  </div>
                  {MOCK_SALON_SERVICES.map(svc => (
                     <div key={svc.id} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex justify-between items-center">
                        <div>
                           <h3 className="font-bold text-gray-900">{svc.name}</h3>
                           <p className="text-xs text-gray-500">{svc.durationMin} mins • {svc.category}</p>
                        </div>
                        <div className="flex items-center gap-4">
                           <span className="font-bold text-primary-600">Rs. {svc.price}</span>
                           <button className="text-gray-400 hover:text-gray-600 text-xs font-bold transition-colors">Edit</button>
                        </div>
                     </div>
                  ))}
               </div>
            )}

            {/* Earnings Tab */}
            {activeTab === 'earnings' && (
               <div className="space-y-6 animate-in fade-in">
                  <div className="bg-gradient-to-br from-purple-900 to-indigo-900 p-6 rounded-2xl text-white shadow-lg">
                      <div className="flex justify-between items-start mb-4">
                          <div>
                              <p className="text-sm text-gray-300 font-bold uppercase">Net Revenue (This Month)</p>
                              <p className="text-4xl font-bold mt-1">Rs. 142,500</p>
                          </div>
                          <button className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-colors active:scale-95 backdrop-blur-sm">
                             Payouts <ArrowUpRight size={16} />
                          </button>
                      </div>
                      <div className="flex gap-6 text-sm">
                          <div>
                              <p className="text-gray-300 text-xs">Total Sales</p>
                              <p className="font-bold">Rs. 165,000</p>
                          </div>
                          <div>
                              <p className="text-gray-300 text-xs">Commission (15%)</p>
                              <p className="font-bold text-red-300">- Rs. 22,500</p>
                          </div>
                      </div>
                  </div>
                  
                  <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                     <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold text-gray-900">Weekly Performance</h3>
                        <button className="flex items-center gap-2 text-xs font-bold text-gray-600 bg-gray-100 px-3 py-2 rounded-lg hover:bg-gray-200 transition-colors active:scale-95">
                           <Download size={14} /> Report
                        </button>
                     </div>
                     <div className="flex items-end gap-2 h-40">
                        {[50, 70, 45, 90, 60, 95, 55].map((h, i) => (
                           <div key={i} className="flex-1 flex flex-col justify-end gap-2 group">
                              <div 
                                className="bg-purple-100 group-hover:bg-purple-600 transition-colors rounded-t-lg w-full relative" 
                                style={{ height: `${h}%` }}
                              ></div>
                              <span className="text-[10px] text-center text-gray-400 font-bold uppercase">
                                 {['M','T','W','T','F','S','S'][i]}
                              </span>
                           </div>
                        ))}
                     </div>
                  </div>
               </div>
            )}

            {/* Settings Tab */}
            {activeTab === 'settings' && (
                <div className="space-y-6 animate-in fade-in">
                    <h2 className="font-bold text-gray-900">Salon Configuration</h2>
                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                        <p className="text-gray-500 text-sm">Manage salon hours, staff profiles, and service categories here.</p>
                        {/* Placeholder for settings form */}
                    </div>
                </div>
            )}

         </div>
      </div>
    </div>
  );
};
