
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Heart, MessageCircle, Share2, MapPin, ShieldCheck, Truck, AlertTriangle, ArrowRight, Camera } from 'lucide-react';
import { Product } from '../types';
import { SEO } from '../components/SEO';
import { useCart } from '../contexts/CartContext';

// Mock Data
const getProductDetails = (id: string): Product => ({
  id,
  sellerId: 'u1',
  sellerName: 'Zara Ahmed',
  sellerRating: 4.9,
  title: 'Dyson Airwrap Complete - Special Edition',
  description: 'Barely used Dyson Airwrap (Vinca Blue/Rosé). Includes all original attachments and the presentation case. Bought from Sephora Dubai last month. Selling because I got the Airstrait. 100% authentic with receipt available.',
  price: 115000,
  condition: 'Used - Like New',
  category: 'Tools',
  postedAt: '2 hours ago',
  location: 'DHA Phase 5, Lahore',
  likes: 45,
  image: "https://picsum.photos/600/600?random=10",
  images: [
    "https://picsum.photos/600/600?random=10",
    "https://picsum.photos/600/600?random=11",
    "https://picsum.photos/600/600?random=12"
  ],
  specs: {
    "Brand": "Dyson",
    "Color": "Vinca Blue",
    "Warranty": "11 Months Left",
    "Original Box": "Yes"
  },
  deliveryOptions: ["Home Delivery (TCS)", "Self Pickup"]
});

export const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [activeImage, setActiveImage] = useState(0);
  const [isAROpen, setIsAROpen] = useState(false);
  const [shippingCost, setShippingCost] = useState<number | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // Simulate API
    setTimeout(() => {
      if (id) setProduct(getProductDetails(id));
    }, 500);
  }, [id]);

  // AR Mock
  useEffect(() => {
     let stream: MediaStream | null = null;
     if (isAROpen) {
        navigator.mediaDevices.getUserMedia({ video: true })
          .then(s => {
             stream = s;
             if (videoRef.current) videoRef.current.srcObject = stream;
          })
          .catch(err => console.error("AR Error", err));
     }
     return () => {
        stream?.getTracks().forEach(track => track.stop());
     };
  }, [isAROpen]);

  const handleEstimateShipping = () => {
     // Mock calculation
     setShippingCost(250);
  };

  if (!product) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div></div>;

  const schema = {
    "@context": "https://schema.org/",
    "@type": "Product",
    "name": product.title,
    "image": product.images,
    "description": product.description,
    "brand": {
      "@type": "Brand",
      "name": product.specs?.['Brand'] || "Generic"
    },
    "offers": {
      "@type": "Offer",
      "priceCurrency": "PKR",
      "price": product.price,
      "itemCondition": "https://schema.org/UsedCondition",
      "availability": "https://schema.org/InStock"
    }
  };

  return (
    <div className="bg-white min-h-screen pb-24">
      <SEO 
        title={product.title}
        description={product.description.substring(0, 150)}
        image={product.image}
        type="product"
        schema={schema}
      />

      {/* --- Image Gallery --- */}
      <div className="relative bg-black aspect-square md:aspect-video group">
        <img src={product.images?.[activeImage]} alt={product.title} className="w-full h-full object-contain" />
        
        {/* Nav Buttons */}
        <button className="absolute top-4 right-4 bg-black/30 backdrop-blur p-2 rounded-full text-white hover:bg-black/50 transition-colors active:scale-90">
          <Share2 size={24} />
        </button>

        {/* Carousel dots */}
        <div className="absolute bottom-4 left-0 w-full flex justify-center gap-2">
           {product.images?.map((_, idx) => (
             <div key={idx} onClick={() => setActiveImage(idx)} className={`w-2 h-2 rounded-full cursor-pointer transition-all ${activeImage === idx ? 'bg-white' : 'bg-white/40 hover:bg-white/70'}`}></div>
           ))}
        </div>
        
        {/* Click areas for next/prev */}
        <div 
          className="absolute inset-y-0 left-0 w-1/4 z-10 cursor-pointer" 
          onClick={() => setActiveImage(prev => Math.max(0, prev - 1))}
        ></div>
        <div 
          className="absolute inset-y-0 right-0 w-1/4 z-10 cursor-pointer" 
          onClick={() => setActiveImage(prev => Math.min((product.images?.length || 1) - 1, prev + 1))}
        ></div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-4">
        
        {/* --- Header Info --- */}
        <div className="mb-6">
          <div className="flex justify-between items-start mb-2">
            <h1 className="text-xl font-bold text-gray-900 leading-snug max-w-[85%]">{product.title}</h1>
            <button className="text-gray-400 hover:text-red-500 transition-colors active:scale-90">
              <Heart size={24} />
            </button>
          </div>
          <div className="flex items-baseline gap-2 mb-2">
             <span className="text-2xl font-bold text-gray-900">Rs. {product.price.toLocaleString()}</span>
             {product.condition && <span className="bg-gray-100 text-gray-600 text-xs font-bold px-2 py-1 rounded uppercase">{product.condition}</span>}
          </div>
          <div className="flex items-center text-gray-500 text-xs">
             <span className="flex items-center gap-1"><MapPin size={12} /> {product.location}</span>
             <span className="mx-2">•</span>
             <span>{product.postedAt}</span>
          </div>
        </div>

        {/* --- Virtual Try On CTA --- */}
        {(product.category === 'Makeup' || product.category === 'Hair') && (
           <div className="mb-6">
              <button 
                onClick={() => setIsAROpen(true)}
                className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white p-3 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg"
              >
                 <Camera size={20} /> Virtual Try-On
              </button>
           </div>
        )}

        {/* --- Seller Info --- */}
        <div className="bg-gray-50 rounded-xl p-4 mb-6 flex items-center justify-between border border-gray-100">
           <div className="flex items-center gap-3">
             <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center text-primary-700 font-bold">
                {product.sellerName.substring(0, 1)}
             </div>
             <div>
               <p className="font-bold text-gray-900 text-sm">{product.sellerName}</p>
               <p className="text-xs text-gray-500 flex items-center gap-1">
                 <ShieldCheck size={12} className="text-green-600" /> Verified Seller • {product.sellerRating} Rating
               </p>
             </div>
           </div>
           <button className="text-xs font-bold text-primary-600 border border-primary-200 px-3 py-1.5 rounded-full hover:bg-primary-50 transition-colors active:scale-95">
             View Profile
           </button>
        </div>

        {/* --- Specs & Description --- */}
        <div className="space-y-6 border-b border-gray-100 pb-6 mb-6">
           <div>
             <h3 className="font-bold text-gray-900 text-sm mb-3">Description</h3>
             <p className="text-sm text-gray-700 whitespace-pre-line leading-relaxed">{product.description}</p>
           </div>
           
           {product.specs && (
             <div>
               <h3 className="font-bold text-gray-900 text-sm mb-3">Specifications</h3>
               <div className="grid grid-cols-2 gap-3">
                 {Object.entries(product.specs).map(([key, val]) => (
                   <div key={key} className="bg-gray-50 p-3 rounded-lg">
                     <span className="block text-[10px] text-gray-400 uppercase font-bold mb-0.5">{key}</span>
                     <span className="block text-sm font-medium text-gray-900">{val}</span>
                   </div>
                 ))}
               </div>
             </div>
           )}

           <div>
             <h3 className="font-bold text-gray-900 text-sm mb-3">Delivery Options</h3>
             <div className="flex gap-3 flex-wrap mb-3">
               {product.deliveryOptions?.map(opt => (
                 <div key={opt} className="flex items-center gap-2 bg-white border border-gray-200 px-3 py-2 rounded-lg text-xs font-bold text-gray-600">
                   <Truck size={14} /> {opt}
                 </div>
               ))}
             </div>
             <div className="flex items-center gap-3 bg-blue-50 p-3 rounded-lg">
                <input placeholder="Enter City" className="bg-white px-3 py-1.5 rounded border border-gray-200 text-sm outline-none w-32" />
                <button onClick={handleEstimateShipping} className="text-xs font-bold text-blue-600 underline">Estimate Shipping</button>
                {shippingCost && <span className="text-sm font-bold text-gray-900 ml-auto">Rs. {shippingCost}</span>}
             </div>
           </div>
        </div>

        {/* --- Safety Tips --- */}
        <div className="mb-6">
          <div className="flex items-center gap-2 text-gray-900 font-bold text-sm mb-2">
            <ShieldCheck size={16} className="text-primary-600" /> Safety Tips
          </div>
          <ul className="text-xs text-gray-500 space-y-1 list-disc pl-5">
            <li>Avoid transferring money before inspecting the item.</li>
            <li>Meet in safe, public places like malls or petrol stations.</li>
            <li>Check the item thoroughly before closing the deal.</li>
          </ul>
          <button className="mt-3 flex items-center gap-1 text-xs text-red-500 font-medium hover:underline">
             <AlertTriangle size={12} /> Report this Ad
          </button>
        </div>

      </div>

      {/* --- Sticky Footer --- */}
      <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 p-4 z-40 flex gap-3 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] safe-area-pb">
        <button 
          onClick={() => addToCart(product)}
          className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-900 font-bold rounded-xl py-3 text-sm flex items-center justify-center gap-2 transition-colors active:scale-95"
        >
          Add to Cart
        </button>
        <button 
          onClick={() => navigate(`/chat/t1`)}
          className="flex-[2] bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-xl py-3 text-sm flex items-center justify-center gap-2 shadow-lg shadow-primary-200 transition-all active:scale-95"
        >
          <MessageCircle size={18} /> Chat with Seller
        </button>
      </div>

      {/* AR Modal */}
      {isAROpen && (
         <div className="fixed inset-0 z-50 bg-black flex flex-col">
            <div className="relative flex-1">
               <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover transform scale-x-[-1]"></video>
               {/* Mock Filter Overlay - Simulates Lipstick */}
               <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 h-8 bg-red-500/30 blur-md rounded-full pointer-events-none mix-blend-overlay"></div>
               
               <button 
                 onClick={() => setIsAROpen(false)}
                 className="absolute top-4 right-4 bg-black/50 text-white px-4 py-2 rounded-full font-bold text-sm"
               >
                 Close AR
               </button>
            </div>
            <div className="bg-black p-6 flex justify-center gap-4">
               {['#FF0000', '#D63384', '#6610f2'].map(color => (
                  <button key={color} className="w-12 h-12 rounded-full border-2 border-white" style={{backgroundColor: color}}></button>
               ))}
            </div>
         </div>
      )}

    </div>
  );
};
