import React from 'react';
import { ChevronRight, Check, Bell, Search, Calendar, Mail } from 'lucide-react';

export const DesignSystemPage: React.FC = () => {
  return (
    <div className="pt-24 pb-24 px-6 max-w-6xl mx-auto relative">
      <div className="mb-12 text-center md:text-left">
        <span className="bg-primary-100 text-primary-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">Design System v1.0</span>
        <h1 className="text-4xl font-bold text-gray-900 mt-4">GlowHub Design Language</h1>
        <p className="text-gray-500 mt-2 text-lg">A collection of tokens, components, and styles for consistent UI.</p>
      </div>

      {/* Colors */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-6 border-b border-gray-200 pb-2">1. Color Palette</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
           <div className="space-y-3">
             <h3 className="font-bold text-sm text-gray-500">Primary (Purple)</h3>
             <div className="h-24 rounded-2xl bg-primary-600 shadow-lg flex items-center justify-center text-white font-bold font-mono">#7B3FE4</div>
             <div className="grid grid-cols-3 gap-2">
                <div className="h-12 rounded-lg bg-primary-500"></div>
                <div className="h-12 rounded-lg bg-primary-100"></div>
                <div className="h-12 rounded-lg bg-primary-900"></div>
             </div>
           </div>
           <div className="space-y-3">
             <h3 className="font-bold text-sm text-gray-500">Secondary (Blue)</h3>
             <div className="h-24 rounded-2xl bg-secondary-500 shadow-lg flex items-center justify-center text-white font-bold font-mono">#1A73E8</div>
             <div className="grid grid-cols-3 gap-2">
                <div className="h-12 rounded-lg bg-blue-400"></div>
                <div className="h-12 rounded-lg bg-secondary-50"></div>
                <div className="h-12 rounded-lg bg-blue-800"></div>
             </div>
           </div>
           <div className="space-y-3">
             <h3 className="font-bold text-sm text-gray-500">Accent (Gold)</h3>
             <div className="h-24 rounded-2xl bg-accent-400 shadow-lg flex items-center justify-center text-white font-bold font-mono">#FFCA28</div>
             <div className="grid grid-cols-3 gap-2">
                <div className="h-12 rounded-lg bg-yellow-300"></div>
                <div className="h-12 rounded-lg bg-yellow-100"></div>
                <div className="h-12 rounded-lg bg-yellow-600"></div>
             </div>
           </div>
           <div className="space-y-3">
             <h3 className="font-bold text-sm text-gray-500">Neutral</h3>
             <div className="h-24 rounded-2xl bg-gray-900 shadow-lg flex items-center justify-center text-white font-bold font-mono">#1F1F1F</div>
             <div className="grid grid-cols-3 gap-2">
                <div className="h-12 rounded-lg bg-gray-500"></div>
                <div className="h-12 rounded-lg bg-gray-200"></div>
                <div className="h-12 rounded-lg bg-gray-50"></div>
             </div>
           </div>
        </div>
      </section>

      {/* Typography */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-6 border-b border-gray-200 pb-2">2. Typography</h2>
        <div className="grid md:grid-cols-2 gap-12">
           <div>
             <h3 className="text-sm font-bold text-gray-400 uppercase mb-4">Headings (Poppins)</h3>
             <div className="space-y-4">
               <div>
                 <span className="text-xs text-gray-400">H1 / Bold / 36-60px</span>
                 <h1 className="text-5xl font-bold text-gray-900">Look Good, Feel Confident.</h1>
               </div>
               <div>
                 <span className="text-xs text-gray-400">H2 / Bold / 24-30px</span>
                 <h2 className="text-2xl font-bold text-gray-900">Upcoming Appointments</h2>
               </div>
               <div>
                 <span className="text-xs text-gray-400">H3 / SemiBold / 18-24px</span>
                 <h3 className="text-xl font-semibold text-gray-900">The Gentleman's Lounge</h3>
               </div>
             </div>
           </div>
           <div>
             <h3 className="text-sm font-bold text-gray-400 uppercase mb-4">Body (Inter)</h3>
             <div className="space-y-4">
               <div>
                 <span className="text-xs text-gray-400">Body Large</span>
                 <p className="text-lg text-gray-600">Book top-rated barbers & salons instantly or shop trending beauty products from trusted local sellers.</p>
               </div>
               <div>
                 <span className="text-xs text-gray-400">Body Regular</span>
                 <p className="text-base text-gray-600">Experience the finest grooming in Lahore. We specialize in classic scissor cuts, luxury hot towel shaves, and relaxing facials.</p>
               </div>
               <div>
                 <span className="text-xs text-gray-400">Caption</span>
                 <p className="text-sm text-gray-500">Free cancellation available until 2 hours before appointment.</p>
               </div>
             </div>
           </div>
        </div>
      </section>

      {/* Components */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-6 border-b border-gray-200 pb-2">3. Components</h2>
        
        {/* Buttons */}
        <div className="mb-10">
          <h3 className="text-sm font-bold text-gray-400 uppercase mb-4">Buttons</h3>
          <div className="flex flex-wrap gap-4 items-center">
             <button className="bg-primary-600 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-primary-200 hover:bg-primary-700 transition-all">
                Primary Action
             </button>
             <button className="bg-gray-900 text-white px-6 py-3 rounded-xl font-bold shadow-lg hover:bg-black transition-all">
                Secondary Action
             </button>
             <button className="bg-white border border-gray-200 text-gray-700 px-6 py-3 rounded-xl font-bold hover:bg-gray-50 transition-all">
                Outline / Ghost
             </button>
             <button className="bg-secondary-500 text-white w-12 h-12 rounded-full flex items-center justify-center shadow-lg hover:bg-secondary-600 transition-all">
                <Search size={20} />
             </button>
             <button disabled className="bg-gray-200 text-gray-400 px-6 py-3 rounded-xl font-bold cursor-not-allowed">
                Disabled
             </button>
          </div>
        </div>

        {/* Badges */}
        <div className="mb-10">
          <h3 className="text-sm font-bold text-gray-400 uppercase mb-4">Status Badges</h3>
          <div className="flex gap-3">
             <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1"><Check size={12}/> Available</span>
             <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-bold">Busy</span>
             <span className="bg-primary-100 text-primary-700 px-3 py-1 rounded-full text-xs font-bold">New Arrival</span>
             <span className="bg-accent-400/20 text-yellow-700 px-3 py-1 rounded-full text-xs font-bold">Premium</span>
          </div>
        </div>

        {/* Cards */}
        <div className="mb-10">
          <h3 className="text-sm font-bold text-gray-400 uppercase mb-4">Cards</h3>
          <div className="grid md:grid-cols-2 gap-6">
             {/* Product Card Variant */}
             <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow max-w-sm">
                <div className="h-40 bg-gray-100 rounded-xl mb-4 flex items-center justify-center text-gray-300">Product Image</div>
                <div className="flex justify-between items-start">
                   <div>
                      <h4 className="font-bold text-gray-900">Dyson Airwrap</h4>
                      <p className="text-xs text-gray-500">Used - Like New</p>
                   </div>
                   <span className="font-bold text-primary-600">Rs. 115,000</span>
                </div>
                <button className="w-full mt-4 bg-white border border-gray-200 text-gray-900 font-bold py-2 rounded-lg text-sm hover:bg-gray-50">View Details</button>
             </div>
             
             {/* Booking Card Variant */}
             <div className="bg-white p-4 rounded-2xl shadow-sm border border-l-4 border-primary-600 max-w-sm">
                <div className="flex justify-between items-start mb-2">
                   <div>
                      <h4 className="font-bold text-gray-900">Signature Haircut</h4>
                      <p className="text-xs text-gray-500">The Gentleman's Lounge</p>
                   </div>
                   <div className="bg-primary-50 text-primary-700 p-2 rounded-lg">
                      <Calendar size={18} />
                   </div>
                </div>
                <div className="flex gap-4 mt-4 text-sm">
                   <span className="font-bold text-gray-900">10:00 AM</span>
                   <span className="text-gray-400">|</span>
                   <span className="text-gray-600">Oct 24, 2023</span>
                </div>
             </div>
          </div>
        </div>

        {/* Form Elements */}
        <div className="mb-10 max-w-md">
           <h3 className="text-sm font-bold text-gray-400 uppercase mb-4">Inputs</h3>
           <div className="space-y-4">
              <div className="relative">
                 <Mail className="absolute left-4 top-3.5 text-gray-400" size={18} />
                 <input type="email" placeholder="Email Address" className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-11 pr-4 py-3 text-sm focus:ring-2 focus:ring-primary-500 outline-none transition-all" />
              </div>
              <div className="flex gap-2">
                 <input type="text" placeholder="First Name" className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary-500 outline-none" />
                 <input type="text" placeholder="Last Name" className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary-500 outline-none" />
              </div>
           </div>
        </div>

      </section>
    </div>
  );
};