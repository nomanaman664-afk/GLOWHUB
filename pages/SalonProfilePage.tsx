

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapPin, Star, Clock, Phone, Share2, CheckCircle, ChevronLeft, Heart, Calendar, Scissors, User } from 'lucide-react';
import { Salon, Service, Staff } from '../types';
import { SEO } from '../components/SEO';
import { BookingFlow } from '../components/BookingFlow';

// Mock Data Generator for a specific ID
const getSalonDetails = (id: string): Salon => ({
  id,
  name: "The Gentleman's Lounge",
  ownerName: "Rizwan Ahmed",
  location: "Sector Y, DHA Phase 3, Lahore",
  lat: 31.4790,
  lng: 74.3700,
  distance: 2.4,
  eta: "10 mins",
  rating: 4.8,
  reviewsCount: 124,
  image: "https://picsum.photos/400/400?random=1",
  coverImage: "https://picsum.photos/800/400?random=2",
  availability: "FREE",
  startingPrice: 1500,
  tags: ["Premium", "Men Only", "Facials"],
  isVerified: true,
  phone: "+92 300 1234567",
  about: "Experience the finest grooming in Lahore. We specialize in classic scissor cuts, luxury hot towel shaves, and relaxing facials. Our staff is trained internationally to ensure you look your absolute best.",
  gallery: [
    "https://picsum.photos/400/300?random=3",
    "https://picsum.photos/400/300?random=4",
    "https://picsum.photos/400/300?random=5",
  ],
  staff: [
    { id: 'st1', name: 'Ali', role: 'Senior Barber', image: 'https://randomuser.me/api/portraits/men/32.jpg', available: true },
    { id: 'st2', name: 'Usman', role: 'Stylist', image: 'https://randomuser.me/api/portraits/men/45.jpg', available: false },
  ],
  services: [
    { id: 's1', name: 'Signature Haircut', price: 1500, durationMin: 45, category: 'Hair' },
    { id: 's2', name: 'Beard Trim & Shape', price: 800, durationMin: 20, category: 'Beard' },
    { id: 's3', name: 'Charcoal Facial', price: 2500, durationMin: 60, category: 'Face' },
    { id: 's4', name: 'Keratin Treatment', price: 8000, durationMin: 120, category: 'Hair' },
  ],
  reviews: [
    { id: 'r1', authorName: 'Bilal K.', rating: 5, date: '2 days ago', text: 'Best fade in DHA. Ali is a magician!' },
    { id: 'r2', authorName: 'Hamza R.', rating: 4, date: '1 week ago', text: 'Great ambiance, slightly expensive but worth it.' },
  ]
});

export const SalonProfilePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [salon, setSalon] = useState<Salon | null>(null);
  const [activeTab, setActiveTab] = useState<'services' | 'about' | 'reviews'>('services');
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [isBookModalOpen, setIsBookModalOpen] = useState(false);

  useEffect(() => {
    // Simulate API Call
    setTimeout(() => {
      if (id) setSalon(getSalonDetails(id));
    }, 500);
  }, [id]);

  if (!salon) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div></div>;

  // Schema.org Data for SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BeautySalon",
    "name": salon.name,
    "image": salon.image,
    "priceRange": "PKR 1000-10000",
    "telephone": salon.phone,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": salon.location,
      "addressLocality": "Lahore",
      "addressCountry": "PK"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": salon.rating,
      "reviewCount": salon.reviewsCount
    }
  };

  return (
    <div className="bg-white min-h-screen pb-24 relative">
      <SEO 
        title={salon.name} 
        description={`Book appointment at ${salon.name} in ${salon.location}. Rated ${salon.rating}/5. Services: ${salon.services.map(s => s.name).join(', ')}.`}
        image={salon.coverImage}
        type="profile"
        schema={structuredData}
      />

      {/* --- Header / Hero --- */}
      <div className="relative h-48 md:h-64 bg-gray-200">
        <img src={salon.coverImage} alt="Cover" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        <button className="absolute top-4 right-4 bg-white/20 backdrop-blur p-2 rounded-full text-white hover:bg-white/40 transition-colors active:scale-90">
          <Share2 size={24} />
        </button>
      </div>

      <div className="px-4 -mt-12 relative z-10 flex justify-between items-end">
        <div className="flex items-end gap-3">
          <img src={salon.image} alt="Profile" className="w-24 h-24 rounded-xl border-4 border-white shadow-lg object-cover bg-gray-100" />
          <div className="mb-2">
            <h1 className="text-xl font-bold text-white drop-shadow-md leading-tight">{salon.name}</h1>
            {salon.isVerified && (
              <span className="flex items-center gap-1 text-xs font-bold text-white bg-blue-500/80 backdrop-blur px-2 py-0.5 rounded-full w-fit mt-1">
                <CheckCircle size={12} /> Verified Salon
              </span>
            )}
          </div>
        </div>
        <div className="mb-3 bg-white px-3 py-1 rounded-lg shadow-sm flex flex-col items-center">
           <span className="flex items-center gap-1 font-bold text-gray-900"><Star size={14} className="fill-yellow-400 text-yellow-400"/> {salon.rating}</span>
           <span className="text-[10px] text-gray-400">{salon.reviewsCount} reviews</span>
        </div>
      </div>

      {/* --- Meta Info --- */}
      <div className="px-4 py-4 border-b border-gray-100">
        <p className="text-gray-500 text-sm flex items-center gap-2 mb-2">
          <MapPin size={16} className="text-primary-600" /> {salon.location}
        </p>
        <div className="flex gap-2 mt-3">
           <span className={`px-3 py-1 rounded-full text-xs font-bold ${salon.availability === 'FREE' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
             {salon.availability === 'FREE' ? 'Available Now' : 'Busy Now'}
           </span>
           <span className="px-3 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-600 flex items-center gap-1">
             <Clock size={12} /> Open until 10 PM
           </span>
        </div>
      </div>

      {/* --- Tabs Navigation --- */}
      <div className="sticky top-0 md:top-[80px] bg-white z-20 border-b border-gray-100 flex">
        {['services', 'about', 'reviews'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as any)}
            className={`flex-1 py-3 text-sm font-bold capitalize transition-colors relative ${activeTab === tab ? 'text-primary-600' : 'text-gray-500 hover:text-primary-500'}`}
          >
            {tab}
            {activeTab === tab && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary-600"></div>}
          </button>
        ))}
      </div>

      {/* --- Tab Content --- */}
      <div className="p-4 min-h-[300px]">
        
        {/* Services Tab */}
        {activeTab === 'services' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
             {/* Mock Staff Selector */}
             <div>
               <h3 className="font-bold text-gray-900 text-sm mb-3">Select Professional</h3>
               <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
                 <div className="flex flex-col items-center gap-1 min-w-[60px]">
                    <div className="w-14 h-14 rounded-full bg-primary-100 border-2 border-primary-600 flex items-center justify-center text-primary-600 font-bold text-xs">Any</div>
                    <span className="text-xs text-gray-700 font-medium">Any</span>
                 </div>
                 {salon.staff?.map(staff => (
                   <div key={staff.id} className="flex flex-col items-center gap-1 min-w-[60px] opacity-70 hover:opacity-100 transition-opacity">
                      <div className="relative">
                        <img src={staff.image} alt={staff.name} className="w-14 h-14 rounded-full object-cover border border-gray-200" />
                        {staff.available && <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>}
                      </div>
                      <span className="text-xs text-gray-700 font-medium">{staff.name}</span>
                   </div>
                 ))}
               </div>
             </div>

             {/* Service Categories */}
             {['Hair', 'Beard', 'Face'].map(cat => {
               const catServices = salon.services.filter(s => s.category === cat);
               if (catServices.length === 0) return null;
               return (
                 <div key={cat}>
                   <h3 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                     <Scissors size={16} className="text-gray-400" /> {cat}
                   </h3>
                   <div className="space-y-3">
                     {catServices.map(service => (
                       <div 
                        key={service.id} 
                        onClick={() => setSelectedService(selectedService === service.id ? null : service.id)}
                        className={`border rounded-xl p-3 flex justify-between items-center cursor-pointer transition-all ${selectedService === service.id ? 'border-primary-600 bg-primary-50 ring-1 ring-primary-600' : 'border-gray-100 hover:border-gray-300'}`}
                       >
                         <div>
                           <h4 className="font-bold text-gray-900 text-sm">{service.name}</h4>
                           <p className="text-xs text-gray-500 mt-0.5">{service.durationMin} mins • Barbershop Standard</p>
                         </div>
                         <div className="text-right">
                           <span className="block font-bold text-primary-600 text-sm">Rs. {service.price}</span>
                           <div className={`w-5 h-5 rounded-full border-2 mt-1 ml-auto flex items-center justify-center ${selectedService === service.id ? 'border-primary-600 bg-primary-600' : 'border-gray-300'}`}>
                             {selectedService === service.id && <CheckCircle size={12} className="text-white" />}
                           </div>
                         </div>
                       </div>
                     ))}
                   </div>
                 </div>
               )
             })}
          </div>
        )}

        {/* About Tab */}
        {activeTab === 'about' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div>
              <h3 className="font-bold text-gray-900 mb-2">About</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{salon.about}</p>
            </div>
            <div>
              <h3 className="font-bold text-gray-900 mb-2">Gallery</h3>
              <div className="flex overflow-x-auto gap-2 pb-2 snap-x">
                {salon.gallery?.map((img, idx) => (
                  <img key={idx} src={img} alt="Gallery" className="w-64 h-40 object-cover rounded-xl snap-center bg-gray-100" />
                ))}
              </div>
            </div>
            <div>
              <h3 className="font-bold text-gray-900 mb-2">Location</h3>
              <div className="bg-gray-100 h-40 rounded-xl flex items-center justify-center text-gray-400 border border-gray-200">
                 <MapPin size={32} />
                 <span className="ml-2 text-sm">Map Integration Placeholder</span>
              </div>
              <button className="w-full mt-2 py-2 text-primary-600 text-sm font-bold border border-primary-100 rounded-lg hover:bg-primary-50 transition-colors active:scale-95">
                Get Directions
              </button>
            </div>
          </div>
        )}

        {/* Reviews Tab */}
        {activeTab === 'reviews' && (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
             <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-xl">
                <div className="text-center">
                   <span className="text-3xl font-bold text-gray-900">{salon.rating}</span>
                   <div className="flex text-yellow-400 justify-center my-1"><Star size={12} fill="currentColor" /><Star size={12} fill="currentColor" /><Star size={12} fill="currentColor" /><Star size={12} fill="currentColor" /><Star size={12} fill="currentColor" /></div>
                   <span className="text-[10px] text-gray-500">{salon.reviewsCount} reviews</span>
                </div>
                <div className="flex-1 space-y-1">
                   {[5, 4, 3, 2, 1].map(star => (
                     <div key={star} className="flex items-center gap-2 text-xs text-gray-500">
                        <span className="w-3">{star}</span>
                        <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                           <div className="h-full bg-yellow-400 rounded-full" style={{ width: star === 5 ? '70%' : star === 4 ? '20%' : '5%' }}></div>
                        </div>
                     </div>
                   ))}
                </div>
             </div>
             
             <div className="flex gap-2 overflow-x-auto no-scrollbar">
                {['All', 'With Photos', 'Positive', 'Critical'].map(f => (
                  <button key={f} className="px-3 py-1 rounded-full bg-white border border-gray-200 text-xs font-medium text-gray-600 whitespace-nowrap hover:bg-gray-50 transition-colors active:scale-95">{f}</button>
                ))}
             </div>

             <div className="space-y-4">
                {salon.reviews?.map(review => (
                  <div key={review.id} className="border-b border-gray-100 pb-4">
                    <div className="flex justify-between mb-1">
                       <span className="font-bold text-sm text-gray-900">{review.authorName}</span>
                       <span className="text-xs text-gray-400">{review.date}</span>
                    </div>
                    <div className="flex text-yellow-400 mb-2">
                      {Array(5).fill(0).map((_, i) => <Star key={i} size={10} fill={i < review.rating ? "currentColor" : "none"} className={i >= review.rating ? "text-gray-300" : ""} />)}
                    </div>
                    <p className="text-sm text-gray-600">{review.text}</p>
                  </div>
                ))}
             </div>
          </div>
        )}
      </div>

      {/* --- Sticky Bottom CTA --- */}
      <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 p-4 z-40 flex gap-3 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] safe-area-pb">
         <div className="flex flex-col">
            <span className="text-xs text-gray-400 font-medium">Total</span>
            <span className="text-lg font-bold text-gray-900">
              {selectedService ? `Rs. ${salon.services.find(s => s.id === selectedService)?.price}` : 'Rs. 0'}
            </span>
         </div>
         <button 
          onClick={() => setIsBookModalOpen(true)}
          className="flex-1 bg-gray-900 hover:bg-black text-white font-bold rounded-xl shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2"
         >
           <Calendar size={18} /> {selectedService ? 'Continue Booking' : 'Book Appointment'}
         </button>
      </div>
      
      {/* Full Booking Flow Wizard */}
      {isBookModalOpen && (
        <BookingFlow 
          salon={salon} 
          initialServiceId={selectedService} 
          onClose={() => setIsBookModalOpen(false)} 
        />
      )}
    </div>
  );
};