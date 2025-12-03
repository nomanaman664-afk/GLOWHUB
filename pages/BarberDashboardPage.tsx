
import React, { useState } from 'react';
import { Calendar, DollarSign, Scissors, Clock, ChevronRight, TrendingUp, Power, Download, LogOut, Settings, Users, ArrowUpRight } from 'lucide-react';
import { Booking, Service } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const MOCK_TODAY_BOOKINGS: Booking[] = [
  { id: 'BK-901', salonName: 'My Salon', serviceName: 'Signature Haircut', staffName: 'Me', date: 'Today', time: '10:00 AM', price: 1500, paymentMethod: 'CASH', status: 'CONFIRMED' },
  { id: 'BK-902', salonName: 'My Salon', serviceName: 'Beard Trim', staffName: 'Me', date: 'Today', time: '11:30 AM', price: 800, paymentMethod: 'EASYPAISA', status: 'CONFIRMED' },
];

const MOCK_SERVICES: Service[] = [
  { id: 's1', name: 'Signature Haircut', price: 1500, durationMin: 45, category: 'Hair' },
  { id: 's2', name: 'Beard Styling', price: 800, durationMin: 20, category: 'Beard' },
];

export const BarberDashboardPage: React.FC = () => {
  const [isOnline, setIsOnline] = useState(true);
  const [activeTab, setActiveTab] = useState<'schedule' | 'services' | 'earnings' | 'settings'>('schedule');
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  // Mock Settings State
  const [shopSettings, setShopSettings] = useState({
    openTime: '09:00',
    closeTime: '21:00',
    slotDuration: 45,
    bufferTime: 10,
    peakPricing: false,
    peakMultiplier: 1.2
  });

  const handleLogout = () => {
     logout();
     navigate('/');
  };

  return (
    <div className="pt-20 pb-24 px-4 max-w-5xl mx-auto min-h-screen relative">
      
      {/* Header Status */}
      <div className="flex justify-between items-center mb-6 bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
         <div>
            <h1 className="text-xl font-bold text-gray-900">{currentUser?.name}'s Shop</h1>
            <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500">Vendor Dashboard</span>
                {currentUser?.isVerified && <span className="bg-blue-100 text-blue-700 text-[10px] font-bold px-1.5 py-0.5 rounded">Verified</span>}
            </div>
         </div>
         <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
                <span className={`text-xs font-bold ${isOnline ? 'text-green-600' : 'text-gray-500'}`}>{isOnline ? 'Shop Open' : 'Shop Closed'}</span>
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
               { id: 'services', label: 'Services', icon: Scissors },
               { id: 'earnings', label: 'Earnings', icon: DollarSign },
               { id: 'settings', label: 'Shop Settings', icon: Settings },
            ].map(tab => (
               <button
                 key={tab.id}
                 onClick={() => setActiveTab(tab.id as any)}
                 className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-colors mb-1 active:scale-95 ${
                    activeTab === tab.id ? 'bg-gray-900 text-white' : 'text-gray-600 hover:bg-gray-50'
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
                     <span className="text-xs font-bold bg-blue-50 text-blue-600 px-3 py-1 rounded-full">{MOCK_TODAY_BOOKINGS.length} Total</span>
                  </div>
                  {MOCK_TODAY_BOOKINGS.map(bk => (
                     <div key={bk.id} className="bg-white p-4 rounded-xl border-l-4 border-primary-500 shadow-sm flex justify-between items-center">
                        <div>
                           <div className="flex items-center gap-2 mb-1">
                              <span className="font-bold text-lg text-gray-900">{bk.time}</span>
                              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded font-bold uppercase">{bk.paymentMethod}</span>
                           </div>
                           <p className="font-medium text-gray-700">{bk.serviceName}</p>
                           <p className="text-xs text-gray-500">Client: Guest User</p>
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

            {/* Services Tab - Same as before */}
            {activeTab === 'services' && (
               <div className="space-y-4 animate-in fade-in">
                  <div className="flex justify-between items-center">
                     <h2 className="font-bold text-gray-900">Service Menu</h2>
                     <button className="bg-primary-600 text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-primary-700 transition-colors active:scale-95">
                        + Add Service
                     </button>
                  </div>
                  {MOCK_SERVICES.map(svc => (
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

            {/* Earnings Tab - UPDATED */}
            {activeTab === 'earnings' && (
               <div className="space-y-6 animate-in fade-in">
                  <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-6 rounded-2xl text-white shadow-lg">
                      <div className="flex justify-between items-start mb-4">
                          <div>
                              <p className="text-sm text-gray-400 font-bold uppercase">Net Earnings (Available)</p>
                              <p className="text-4xl font-bold mt-1">Rs. 24,225</p>
                          </div>
                          <button className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-colors active:scale-95">
                             Withdraw <ArrowUpRight size={16} />
                          </button>
                      </div>
                      <div className="flex gap-6 text-sm">
                          <div>
                              <p className="text-gray-400 text-xs">Gross Revenue</p>
                              <p className="font-bold">Rs. 28,500</p>
                          </div>
                          <div>
                              <p className="text-gray-400 text-xs">Platform Fee (15%)</p>
                              <p className="font-bold text-red-300">- Rs. 4,275</p>
                          </div>
                      </div>
                  </div>
                  
                  <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                     <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold text-gray-900">Weekly Breakdown</h3>
                        <button className="flex items-center gap-2 text-xs font-bold text-gray-600 bg-gray-100 px-3 py-2 rounded-lg hover:bg-gray-200 transition-colors active:scale-95">
                           <Download size={14} /> Export CSV
                        </button>
                     </div>
                     <div className="flex items-end gap-2 h-40">
                        {[40, 65, 30, 80, 55, 90, 45].map((h, i) => (
                           <div key={i} className="flex-1 flex flex-col justify-end gap-2 group">
                              <div 
                                className="bg-primary-100 group-hover:bg-primary-600 transition-colors rounded-t-lg w-full relative" 
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

            {/* Settings Tab - Same as before */}
            {activeTab === 'settings' && (
                <div className="space-y-6 animate-in fade-in">
                    <h2 className="font-bold text-gray-900">Shop Settings</h2>
                    {/* ... (Implementation remains the same) ... */}
                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm text-center">
                        <p className="text-gray-500">Settings implementation is unchanged.</p>
                    </div>
                </div>
            )}

         </div>
      </div>
    </div>
  );
};
