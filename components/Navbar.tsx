
import React, { useState, useEffect, useRef } from 'react';
import { Home, Scissors, ShoppingBag, User, ChevronDown, ArrowRight, ArrowLeft, LogIn, Menu, X, PlusCircle, Briefcase, Store, BookOpen, Info } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { UserRole } from '../types';

export const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, currentUser, userRole, logout } = useAuth();
  const { cartCount, toggleCart } = useCart();
  
  // State for dropdowns and mobile menu
  const [isBusinessMenuOpen, setIsBusinessMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const businessMenuRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  const isActive = (path: string) => location.pathname === path;
  const canGoBack = location.key !== 'default' && location.pathname !== '/';

  // Close menus on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (businessMenuRef.current && !businessMenuRef.current.contains(event.target as Node)) {
        setIsBusinessMenuOpen(false);
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node)) {
        setIsMobileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  // Hide Navbar on specific flow pages
  const isAuthPage = location.pathname === '/login' || location.pathname === '/signup';
  const isAdminPage = location.pathname.startsWith('/admin');
  
  if (isAdminPage || isAuthPage) return null;

  // --- Reusable Nav Link Component ---
  const NavLink = ({ to, label }: { to: string, label: string }) => (
    <button
      onClick={() => navigate(to)}
      className={`relative px-3 lg:px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 whitespace-nowrap ${
        isActive(to) 
          ? 'bg-primary-50 text-primary-700 font-bold' 
          : 'text-gray-600 hover:bg-gray-50 hover:text-primary-600'
      }`}
    >
      {label}
    </button>
  );

  return (
    <>
      {/* =======================
          DESKTOP NAVIGATION
      ======================== */}
      <header className="hidden md:flex fixed top-0 left-0 w-full bg-white/90 backdrop-blur-xl border-b border-gray-100 z-50 h-20 items-center px-4 lg:px-10 transition-all">
        
        {/* LEFT GROUP: Logo (Flex-1 to push center) */}
        <div className="flex flex-1 items-center justify-start gap-3 z-20 min-w-0">
            {/* Subtle Back Button */}
            <button
                onClick={() => navigate(-1)}
                disabled={!canGoBack}
                className={`p-2 rounded-full transition-all text-gray-400 hover:text-gray-900 hover:bg-gray-100 ${!canGoBack ? 'opacity-0 pointer-events-none w-0 p-0 overflow-hidden' : ''}`}
                aria-label="Go back"
            >
                <ArrowLeft size={18} />
            </button>
            
            <div onClick={() => navigate('/')} className="cursor-pointer group flex items-center gap-2 shrink-0">
                {/* Logo Icon */}
                <div className="w-8 h-8 bg-primary-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary-200 group-hover:scale-105 transition-transform duration-300">
                  <Scissors size={18} className="transform -rotate-12" />
                </div>
                <h1 className="text-xl font-bold font-heading text-gray-900 tracking-tight whitespace-nowrap">
                Glow<span className="text-primary-600">Hub</span>
              </h1>
            </div>
        </div>

        {/* CENTER GROUP: Navigation Links (Static Flex) */}
        <nav className="hidden md:flex items-center justify-center gap-1 lg:gap-2 shrink-0">
            <NavLink to="/" label="Home" />
            <NavLink to="/about" label="About Us" />
            <NavLink to="/services" label="Service" />
            <NavLink to="/blog" label="Blog" />
        </nav>

        {/* RIGHT GROUP: Business Tools + Actions (Flex-1 to push center) */}
        <div className="flex flex-1 items-center justify-end gap-2 lg:gap-4 z-20 min-w-0">
           
           {/* Business Dropdown */}
           {(!isAuthenticated || [UserRole.BARBER, UserRole.SALON_OWNER, UserRole.ADMIN].includes(userRole as any)) && (
            <div className="relative shrink-0" ref={businessMenuRef}>
              <button
                onClick={() => setIsBusinessMenuOpen(!isBusinessMenuOpen)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-full text-sm font-semibold transition-all whitespace-nowrap ${isBusinessMenuOpen ? 'bg-gray-100 text-gray-900' : 'text-gray-500 hover:text-primary-600 hover:bg-gray-50'}`}
              >
                For Business 
                <ChevronDown size={14} className={`transition-transform duration-300 ${isBusinessMenuOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {isBusinessMenuOpen && (
                <div className="absolute top-full right-0 mt-2 w-60 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden animate-in fade-in zoom-in-95 origin-top-right p-1.5 z-50">
                   {isAuthenticated ? (
                     <>
                       <div className="px-4 py-2 text-xs font-bold text-gray-400 uppercase tracking-wider">Dashboard</div>
                       {userRole === UserRole.BARBER && <button onClick={() => navigate('/dashboard/barber')} className="w-full text-left px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-primary-50 hover:text-primary-700 rounded-xl transition-colors">Barber Dashboard</button>}
                       {userRole === UserRole.SALON_OWNER && <button onClick={() => navigate('/dashboard/salon')} className="w-full text-left px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-primary-50 hover:text-primary-700 rounded-xl transition-colors">Salon Dashboard</button>}
                       {userRole === UserRole.ADMIN && <button onClick={() => navigate('/admin')} className="w-full text-left px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-primary-50 hover:text-primary-700 rounded-xl transition-colors">Admin Panel</button>}
                     </>
                   ) : (
                     <>
                       <button onClick={() => navigate('/signup')} className="w-full text-left px-4 py-3 text-sm font-bold text-gray-800 hover:bg-gray-50 rounded-xl transition-colors flex items-center gap-2">
                         <Store size={16} className="text-primary-500"/> Register Business
                       </button>
                       <button onClick={() => navigate('/signup')} className="w-full text-left px-4 py-3 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-xl transition-colors">
                         Partner Guidelines
                       </button>
                     </>
                   )}
                </div>
              )}
            </div>
           )}

           {/* Actions */}
           <div className="flex items-center gap-2 lg:gap-3 shrink-0">
             <button 
               onClick={toggleCart} 
               className="relative p-2.5 text-gray-500 hover:text-primary-600 hover:bg-primary-50 rounded-full transition-all group"
               aria-label="Open Cart"
             >
               <ShoppingBag size={20} className="group-hover:scale-105 transition-transform" />
               {cartCount > 0 && (
                 <span className="absolute top-0 right-0 bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center ring-2 ring-white animate-in zoom-in">
                   {cartCount}
                 </span>
               )}
             </button>

             {isAuthenticated ? (
               <button 
                 onClick={() => navigate('/profile')} 
                 className="flex items-center gap-3 pl-1 pr-4 py-1 rounded-full border border-gray-200 hover:border-primary-200 hover:shadow-md transition-all group bg-white"
               >
                  <img src={currentUser?.avatar} alt="Profile" className="w-9 h-9 rounded-full bg-gray-100 object-cover ring-2 ring-white group-hover:ring-primary-100 transition-all" />
                  <div className="flex flex-col items-start leading-none gap-0.5 max-w-[80px]">
                     <span className="text-xs font-bold text-gray-900 group-hover:text-primary-700 truncate w-full">{currentUser?.name.split(' ')[0]}</span>
                     <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wide truncate w-full">{currentUser?.role.replace('_', ' ')}</span>
                  </div>
               </button>
             ) : (
               <button 
                 onClick={() => navigate('/login')}
                 className="flex items-center gap-2 bg-primary-600 text-white px-5 lg:px-6 py-2.5 rounded-full font-bold text-sm shadow-lg shadow-primary-200 hover:bg-primary-700 hover:scale-105 transition-all active:scale-95 whitespace-nowrap"
               >
                 Login <ArrowRight size={16} className="opacity-60 hidden lg:block" />
               </button>
             )}
           </div>
        </div>
      </header>


      {/* =======================
          MOBILE NAVIGATION
      ======================== */}
      
      {/* 1. Mobile Top Bar (Logo + Hamburger) */}
      <header className="md:hidden fixed top-0 left-0 w-full bg-white/90 backdrop-blur-md border-b border-gray-100 z-50 h-16 flex items-center justify-between px-4">
         <div onClick={() => navigate('/')} className="flex items-center gap-2 cursor-pointer">
            <h1 className="text-xl font-bold font-heading text-gray-900">
              Glow<span className="text-primary-600">Hub</span>
            </h1>
         </div>
         <div className="flex items-center gap-2">
            <button 
               onClick={toggleCart} 
               className="relative p-2 text-gray-600 active:scale-95 transition-transform"
             >
               <ShoppingBag size={22} />
               {cartCount > 0 && (
                 <span className="absolute top-1 right-1 bg-red-500 text-white text-[9px] font-bold w-3.5 h-3.5 rounded-full flex items-center justify-center ring-1 ring-white">
                   {cartCount}
                 </span>
               )}
            </button>
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-2 text-gray-700 active:scale-95 transition-transform"
            >
               <Menu size={24} />
            </button>
         </div>
      </header>

      {/* 2. Mobile Menu Drawer (For Business & Extras) */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[60] md:hidden">
           <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)}></div>
           <div 
             ref={mobileMenuRef}
             className="absolute top-0 right-0 w-4/5 max-w-sm h-full bg-white shadow-2xl p-6 flex flex-col animate-in slide-in-from-right duration-300"
           >
              <div className="flex justify-between items-center mb-8">
                 <h2 className="font-bold text-lg text-gray-900">Menu</h2>
                 <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 bg-gray-50 rounded-full hover:bg-gray-100 text-gray-500">
                    <X size={20} />
                 </button>
              </div>

              <div className="space-y-6 flex-1 overflow-y-auto">
                 {/* User Actions */}
                 {!isAuthenticated && (
                   <div className="bg-primary-50 p-4 rounded-2xl flex items-center gap-4 mb-6 cursor-pointer hover:bg-primary-100 transition-colors" onClick={() => navigate('/login')}>
                      <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-primary-600 shadow-sm">
                         <LogIn size={20} />
                      </div>
                      <div>
                         <p className="font-bold text-gray-900 text-lg">Login / Signup</p>
                         <p className="text-xs text-gray-500">Access your account</p>
                      </div>
                   </div>
                 )}

                 {/* Main Navigation (Mobile Only) */}
                 <div>
                    <h3 className="text-xs font-bold text-gray-400 uppercase mb-3 tracking-wider">Explore</h3>
                    <div className="space-y-2">
                       <button onClick={() => navigate('/about')} className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 text-left transition-colors">
                          <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-600"><Info size={18}/></div>
                          <span className="font-medium text-gray-700">About Us</span>
                       </button>
                       <button onClick={() => navigate('/blog')} className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 text-left transition-colors">
                          <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-600"><BookOpen size={18}/></div>
                          <span className="font-medium text-gray-700">Blog</span>
                       </button>
                    </div>
                 </div>

                 {/* Business Links */}
                 <div>
                    <h3 className="text-xs font-bold text-gray-400 uppercase mb-3 tracking-wider">For Business</h3>
                    <div className="space-y-2">
                       <button onClick={() => navigate('/marketplace')} className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 text-left transition-colors">
                          <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-600"><PlusCircle size={18}/></div>
                          <span className="font-medium text-gray-700">Post an Ad</span>
                       </button>
                       <button onClick={() => navigate('/signup')} className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 text-left transition-colors">
                          <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-600"><Briefcase size={18}/></div>
                          <span className="font-medium text-gray-700">Register as Partner</span>
                       </button>
                    </div>
                 </div>

                 {/* Dashboards (If Logged In) */}
                 {isAuthenticated && (userRole === UserRole.BARBER || userRole === UserRole.SALON_OWNER || userRole === UserRole.ADMIN) && (
                    <div>
                      <h3 className="text-xs font-bold text-gray-400 uppercase mb-3 tracking-wider">Dashboards</h3>
                      <div className="space-y-2">
                          {userRole === UserRole.BARBER && (
                            <button onClick={() => navigate('/dashboard/barber')} className="w-full p-3 bg-gray-50 rounded-xl text-left font-bold text-sm text-gray-800 hover:bg-gray-100">My Barber Shop</button>
                          )}
                          {userRole === UserRole.SALON_OWNER && (
                            <button onClick={() => navigate('/dashboard/salon')} className="w-full p-3 bg-gray-50 rounded-xl text-left font-bold text-sm text-gray-800 hover:bg-gray-100">My Salon</button>
                          )}
                          {userRole === UserRole.ADMIN && (
                            <button onClick={() => navigate('/admin')} className="w-full p-3 bg-gray-50 rounded-xl text-left font-bold text-sm text-gray-800 hover:bg-gray-100">Admin Panel</button>
                          )}
                      </div>
                    </div>
                 )}
              </div>

              <div className="pt-6 border-t border-gray-100 text-center">
                 <p className="text-xs text-gray-400">GlowHub Pakistan v1.2</p>
                 <div className="flex justify-center gap-4 mt-3">
                    <span className="text-xs text-gray-300">Privacy</span>
                    <span className="text-xs text-gray-300">Terms</span>
                 </div>
              </div>
           </div>
        </div>
      )}

      {/* 3. Mobile Bottom Navigation (Core User Flow) */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full bg-white/95 backdrop-blur-xl border-t border-gray-200 z-40 h-[safe-area-inset-bottom+70px] pb-[safe-area-inset-bottom]">
        <div className="flex justify-around items-center h-16">
          {[
            { name: 'Home', icon: Home, path: '/' },
            { name: 'Services', icon: Scissors, path: '/services' },
            { name: 'Shop', icon: ShoppingBag, path: '/marketplace' },
          ].map((item) => (
            <button
              key={item.name}
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center justify-center w-20 h-full transition-all duration-300 ${
                isActive(item.path) ? 'text-primary-600' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <item.icon size={24} className={isActive(item.path) ? 'fill-current' : ''} />
              <span className={`text-[10px] font-bold mt-1 transition-all ${isActive(item.path) ? 'scale-100' : 'scale-0 h-0 opacity-0'}`}>{item.name}</span>
            </button>
          ))}
          
          <button
              onClick={() => navigate(isAuthenticated ? '/profile' : '/login')}
              className={`flex flex-col items-center justify-center w-20 h-full transition-all duration-300 ${
                isActive('/profile') ? 'text-primary-600' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              {isAuthenticated ? (
                 <img src={currentUser?.avatar} alt="Me" className={`w-6 h-6 rounded-full object-cover ring-2 ${isActive('/profile') ? 'ring-primary-600' : 'ring-transparent'}`} />
              ) : (
                 <User size={24} />
              )}
              <span className={`text-[10px] font-bold mt-1 transition-all ${isActive('/profile') ? 'scale-100' : 'scale-0 h-0 opacity-0'}`}>{isAuthenticated ? 'Profile' : 'Login'}</span>
            </button>
        </div>
      </nav>
    </>
  );
};
