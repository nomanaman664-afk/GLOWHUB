
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Calendar, ShoppingBag, Settings, Wallet, Bell, Clock, Receipt, AlertCircle, Edit3, LogOut, User as UserIcon, Gift } from 'lucide-react';
import { Booking, Order } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { bookingService } from '../services/bookingService';

const MOCK_BOOKINGS: Booking[] = [
  {
    id: 'BK-8821',
    salonName: "The Gentleman's Lounge",
    serviceName: "Signature Haircut",
    staffName: "Ali",
    date: "2023-10-28",
    time: "05:00 PM",
    price: 1500,
    paymentMethod: 'CASH',
    status: 'CONFIRMED',
    paymentStatus: 'UNPAID'
  },
  {
    id: 'BK-8805',
    salonName: "Depilex Men",
    serviceName: "Beard Trim",
    staffName: "Usman",
    date: "2023-10-15",
    time: "02:00 PM",
    price: 800,
    paymentMethod: 'JAZZCASH',
    status: 'CONFIRMED',
    paymentStatus: 'PAID',
    transactionId: 'TX-123456'
  }
];

const MOCK_ORDERS: Order[] = [
  { id: 'ORD-123', productTitle: 'CeraVe Cleanser', price: 3500, date: '2023-10-20', status: 'DELIVERED', image: 'https://picsum.photos/200/200?random=ord1' },
  { id: 'ORD-124', productTitle: 'Beard Oil', price: 1200, date: '2023-10-25', status: 'PROCESSING', image: 'https://picsum.photos/200/200?random=ord2' },
];

export const UserDashboardPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'bookings' | 'orders' | 'settings'>(location.state?.initialTab || 'overview');
  const [bookings, setBookings] = useState(MOCK_BOOKINGS);

  const handleLogout = () => {
     logout();
     navigate('/');
  };

  const handleCancel = async (id: string) => {
    if(window.confirm("Are you sure you want to cancel this booking?")) {
        await bookingService.cancelBooking(id);
        setBookings(prev => prev.map(b => b.id === id ? { ...b, status: 'CANCELLED' } : b));
    }
  }

  return (
    <div className="pt-20 pb-24 px-4 max-w-4xl mx-auto min-h-screen relative">
      <div className="flex items-center justify-between mb-6">
         <h1 className="text-2xl font-bold text-gray-900">Welcome, {currentUser?.name.split(' ')[0]}</h1>
         <img src={currentUser?.avatar} alt="Profile" className="w-10 h-10 rounded-full border border-gray-200" />
      </div>

      {/* Tabs */}
      <div className="flex overflow-x-auto no-scrollbar gap-2 mb-6">
        {[
          { id: 'overview', label: 'Overview', icon: UserIcon },
          { id: 'bookings', label: 'Bookings', icon: Calendar },
          { id: 'orders', label: 'Orders', icon: ShoppingBag },
          { id: 'settings', label: 'Settings', icon: Settings },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-full font-bold text-sm whitespace-nowrap transition-colors active:scale-95 ${
              activeTab === tab.id 
                ? 'bg-gray-900 text-white shadow-md' 
                : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            <tab.icon size={16} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="space-y-6">
        
        {/* Wallet & Loyalty Summary */}
        {activeTab === 'overview' && (
          <section className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-in fade-in">
             <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-5 rounded-2xl text-white shadow-lg relative overflow-hidden">
                <div className="flex items-center gap-2 mb-4 opacity-80">
                   <Gift size={20} />
                   <span className="text-sm font-medium">Loyalty Points</span>
                </div>
                <p className="text-3xl font-bold">{currentUser?.loyaltyPoints || 1250}</p>
                <p className="text-xs text-gray-400 mt-1">Value: Rs. {currentUser?.loyaltyPoints || 1250}</p>
                <div className="absolute right-0 bottom-0 opacity-10"><Gift size={80} /></div>
             </div>
             
             <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
                <div className="flex items-center gap-2 mb-4 text-gray-500">
                   <Wallet size={20} />
                   <span className="text-sm font-medium">GlowWallet</span>
                </div>
                <div className="flex justify-between items-end">
                   <div>
                       <p className="text-2xl font-bold text-gray-900">Rs. 0</p>
                       <p className="text-xs text-gray-400">Available Balance</p>
                   </div>
                   <button className="bg-primary-50 text-primary-600 px-4 py-2 rounded-lg text-xs font-bold hover:bg-primary-100 transition-colors">Top Up</button>
                </div>
             </div>
          </section>
        )}

        {/* Bookings */}
        {(activeTab === 'overview' || activeTab === 'bookings') && (
          <section className="animate-in fade-in">
            <div className="flex justify-between items-end mb-4">
              <h2 className="text-lg font-bold text-gray-900">Appointments</h2>
              {activeTab === 'overview' && <button onClick={() => setActiveTab('bookings')} className="text-primary-600 text-xs font-bold hover:underline">View All</button>}
            </div>
            <div className="grid gap-4">
              {bookings.map(booking => (
                 <div key={booking.id} className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col sm:flex-row gap-4">
                    <div className="flex-shrink-0 w-16 h-16 bg-primary-50 rounded-xl flex flex-col items-center justify-center text-primary-700 border border-primary-100">
                       <span className="text-[10px] font-bold uppercase">{new Date(booking.date).toLocaleDateString('en-US', { month: 'short' })}</span>
                       <span className="text-xl font-bold leading-none">{new Date(booking.date).getDate()}</span>
                    </div>
                    <div className="flex-1">
                       <div className="flex justify-between items-start">
                          <div>
                             <h3 className="font-bold text-gray-900">{booking.salonName}</h3>
                             <p className="text-sm text-gray-600">{booking.serviceName}</p>
                          </div>
                          <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${booking.status === 'CONFIRMED' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>{booking.status}</span>
                       </div>
                       <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-3 text-xs text-gray-500">
                          <span className="flex items-center gap-1"><Clock size={14}/> {booking.time}</span>
                          <span className="flex items-center gap-1 font-medium">
                            {booking.paymentStatus === 'PAID' ? (
                               <span className="text-green-600 flex items-center gap-1"><Receipt size={14}/> Paid ({booking.paymentMethod})</span>
                            ) : (
                               <span className="text-yellow-600 flex items-center gap-1"><AlertCircle size={14}/> Pay Rs. {booking.price} on Arrival</span>
                            )}
                          </span>
                       </div>
                    </div>
                 </div>
              ))}
            </div>
          </section>
        )}

        {/* Settings Tab (Same as before) */}
        {activeTab === 'settings' && (
           <section className="space-y-8 animate-in fade-in">
             <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <h3 className="font-bold text-gray-900 mb-6">Profile Information</h3>
                <div className="flex items-center gap-6">
                  <div className="relative">
                     <img src={currentUser?.avatar} alt="Avatar" className="w-20 h-20 rounded-full object-cover" />
                     <button className="absolute bottom-0 right-0 bg-white p-1.5 rounded-full shadow-md border border-gray-200 hover:bg-gray-100 transition-colors active:scale-95"><Edit3 size={12}/></button>
                  </div>
                  <div className="grid grid-cols-2 gap-4 flex-1">
                     <input type="text" defaultValue={currentUser?.name} className="bg-gray-50 border border-gray-200 p-3 rounded-lg text-sm" placeholder="Full Name"/>
                     <input type="email" defaultValue={currentUser?.email} className="bg-gray-50 border border-gray-200 p-3 rounded-lg text-sm" placeholder="Email" disabled/>
                  </div>
                </div>
             </div>
             
             <button 
               onClick={handleLogout}
               className="w-full p-4 flex items-center justify-center gap-2 bg-red-50 text-red-600 font-bold rounded-xl hover:bg-red-100 transition-colors active:scale-95"
             >
               <LogOut size={18} /> Log Out
             </button>
           </section>
        )}
        
      </div>
    </div>
  );
};
