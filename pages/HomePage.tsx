
import React from 'react';
import { Search, MapPin, Star, TrendingUp, ChevronRight, Scissors, ShoppingBag, ShieldCheck, Clock, Calendar, Brush, CircleDot } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  return (
    <div className="pb-24 pt-16 md:pt-20">
      {/* --- NEW HERO SECTION --- */}
      <header className="relative overflow-hidden bg-gray-50 text-center px-4 py-20 md:py-32">
        <div className="absolute -top-24 -left-24 w-72 h-72 bg-primary-100/50 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-secondary-50 rounded-full blur-3xl"></div>

        <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center">
            <div className="flex items-center gap-6 text-gray-400 mb-8">
                <Scissors className="w-8 h-8 transform -rotate-12" />
                <div className="w-16 h-0.5 bg-gray-200"></div>
                <Brush className="w-8 h-8" />
                <div className="w-16 h-0.5 bg-gray-200"></div>
                 <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 20l-1-1-1.25-1.25a2 2 0 00-2.83 0l-1.82 1.82a2 2 0 01-2.83 0L10.5 17 2 8.5 8.5 2l8.5 8.5L18 12l2.83 2.83a2 2 0 010 2.83l-1.83 1.83a2 2 0 000 2.83L20 22" />
                    <path d="M6.5 3.5L2 8.5" />
                 </svg>
            </div>

            <h1 className="text-4xl md:text-6xl font-bold font-heading text-dark mb-6 leading-tight tracking-tighter">
                Style Redefined.
                <br />
                <span className="text-primary-600">Bookings Simplified.</span>
            </h1>

            <p className="text-gray-500 mb-10 text-base md:text-lg max-w-2xl font-light">
                Discover and book top-rated barbers and salons in your city.
                Premium grooming, just a click away.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center gap-4">
                <button 
                    onClick={() => navigate('/services')}
                    className="w-full sm:w-auto bg-primary-600 hover:bg-primary-700 text-white px-8 py-4 rounded-full font-bold text-base transition-all shadow-lg hover:shadow-2xl hover:shadow-primary-200 hover:-translate-y-1 transform duration-300 ease-in-out"
                >
                    Book an Appointment
                </button>
                <button 
                    onClick={() => navigate('/marketplace')}
                    className="w-full sm:w-auto bg-white text-gray-700 px-8 py-4 rounded-full font-bold text-base transition-all shadow-sm border border-gray-200 hover:border-gray-300 hover:-translate-y-0.5"
                >
                    Shop Products
                </button>
            </div>
            
            {!isAuthenticated && (
              <p className="mt-6 text-sm text-gray-400">
                 New here? <button onClick={() => navigate('/signup')} className="font-bold text-primary-600 hover:underline">Create a free account</button> to get started.
              </p>
            )}
        </div>
      </header>
      
      <div className="px-4 max-w-7xl mx-auto space-y-12 mt-12">
          {/* Service vs Product Split */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div onClick={() => navigate('/services')} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:border-primary-300 hover:shadow-md transition-all cursor-pointer group relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-bl-full -mr-8 -mt-8 z-0"></div>
                <div className="relative z-10 flex items-center gap-4">
                    <div className="w-14 h-14 rounded-full bg-blue-100 text-primary-600 flex items-center justify-center group-hover:bg-primary-600 group-hover:text-white transition-colors">
                        <Scissors size={28} />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-gray-900">Find Services</h3>
                        <p className="text-sm text-gray-500 mt-1">Book Salons, Spas & Barbers</p>
                    </div>
                    <ChevronRight size={24} className="ml-auto text-gray-300 group-hover:text-primary-600 transition-colors" />
                </div>
            </div>
            <div onClick={() => navigate('/marketplace')} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:border-purple-300 hover:shadow-md transition-all cursor-pointer group relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-purple-50 rounded-bl-full -mr-8 -mt-8 z-0"></div>
                <div className="relative z-10 flex items-center gap-4">
                    <div className="w-14 h-14 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center group-hover:bg-purple-600 group-hover:text-white transition-colors">
                        <ShoppingBag size={28} />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-gray-900">Marketplace</h3>
                        <p className="text-sm text-gray-500 mt-1">Buy & Sell Beauty Products</p>
                    </div>
                    <ChevronRight size={24} className="ml-auto text-gray-300 group-hover:text-purple-600 transition-colors" />
                </div>
            </div>
          </section>

          {/* How It Works */}
          <section className="text-center py-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-10">How GlowHub Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-4">
              <div className="flex flex-col items-center">
                 <div className="w-16 h-16 bg-white shadow-lg rounded-2xl flex items-center justify-center mb-4 text-primary-600">
                   <Search size={32} />
                 </div>
                 <h3 className="font-bold text-lg mb-2">1. Discover</h3>
                 <p className="text-gray-500 text-sm max-w-xs">Search for top-rated salons nearby or find rare beauty products.</p>
              </div>
              <div className="flex flex-col items-center">
                 <div className="w-16 h-16 bg-white shadow-lg rounded-2xl flex items-center justify-center mb-4 text-primary-600">
                   <Calendar size={32} />
                 </div>
                 <h3 className="font-bold text-lg mb-2">2. Book or Buy</h3>
                 <p className="text-gray-500 text-sm max-w-xs">Select your time slot for services or chat with sellers to buy items.</p>
              </div>
              <div className="flex flex-col items-center">
                 <div className="w-16 h-16 bg-white shadow-lg rounded-2xl flex items-center justify-center mb-4 text-primary-600">
                   <ShieldCheck size={32} />
                 </div>
                 <h3 className="font-bold text-lg mb-2">3. Enjoy</h3>
                 <p className="text-gray-500 text-sm max-w-xs">Get groomed professionally or enjoy your new products with confidence.</p>
              </div>
            </div>
          </section>

          {/* Popular Services */}
          <section>
            <div className="flex justify-between items-end mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Top Rated Salons</h2>
                <p className="text-gray-500 text-sm mt-1">Highly recommended by locals</p>
              </div>
              <button onClick={() => navigate('/services')} className="text-primary-600 font-semibold text-sm hover:underline">View All</button>
            </div>
            
            <div className="flex overflow-x-auto gap-5 pb-6 no-scrollbar -mx-4 px-4 md:mx-0 md:px-0">
              {[1, 2, 3].map((i) => (
                <div key={i} onClick={() => navigate('/services')} className="min-w-[280px] md:min-w-[320px] bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl transition-all cursor-pointer group">
                  <div className="h-44 relative overflow-hidden">
                    <img src={`https://picsum.photos/400/300?random=${i + 10}`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="Salon" />
                    <div className="absolute top-3 left-3">
                      <span className="bg-white/90 backdrop-blur text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider text-gray-800">
                        Men's Grooming
                      </span>
                    </div>
                  </div>
                  <div className="p-5">
                    <div className="flex justify-between items-start mb-2">
                        <h3 className="font-bold text-gray-900 text-lg group-hover:text-primary-600 transition-colors">The Royal Barber</h3>
                        <span className="flex items-center gap-1 text-xs font-bold bg-yellow-50 text-yellow-700 px-2 py-1 rounded">
                            <Star size={10} className="fill-yellow-500 text-yellow-500" /> 4.8
                        </span>
                    </div>
                    <p className="text-gray-500 text-sm mb-4 flex items-center gap-1">
                      <MapPin size={14} /> DHA Phase 6, Lahore
                    </p>
                    <div className="flex items-center gap-2 text-xs text-gray-500 border-t border-gray-100 pt-3">
                        <Clock size={12} /> Next Slot: <span className="text-green-600 font-bold">Today, 5:00 PM</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Areas We Cover */}
          <section className="bg-gray-100 rounded-2xl p-8 text-center">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Serving Major Areas</h2>
            <div className="flex flex-wrap justify-center gap-3">
                {['DHA Lahore', 'Gulberg', 'Bahria Town', 'F-6 Islamabad', 'Clifton Karachi', 'Johar Town', 'Wapda Town'].map(area => (
                    <span key={area} className="bg-white px-4 py-2 rounded-full text-sm text-gray-600 shadow-sm hover:shadow-md cursor-default transition-shadow">
                        {area}
                    </span>
                ))}
            </div>
          </section>
      </div>
    </div>
  );
};
