
import React, { useState, useRef } from 'react';
import { Heart, MessageCircle, Share2, Plus, ShoppingCart, User, Sparkles, Loader2, Image as ImageIcon, X, MapPin, MoreHorizontal, Flag, Bookmark, Filter, ChevronLeft, ChevronRight, Camera } from 'lucide-react';
import { Product } from '../types';
import { generateProductDescription } from '../services/geminiService';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';


// --- Mock Data ---
const MOCK_PRODUCTS: Product[] = [
  {
    id: 'p1',
    sellerId: 'u1',
    sellerName: 'Zara Ahmed',
    sellerAvatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    title: 'Dyson Airwrap Complete (Used)',
    description: 'Used for 3 months. Original packaging included. 10/10 condition. Selling because I am moving abroad.',
    price: 115000,
    image: 'https://picsum.photos/600/600?random=201',
    images: ['https://picsum.photos/600/600?random=201', 'https://picsum.photos/600/600?random=2011', 'https://picsum.photos/600/600?random=2012'],
    likes: 42,
    category: 'Tools',
    postedAt: '2h ago',
    condition: 'Used - Like New',
    location: 'DHA Phase 5, Lahore',
    tags: ['Premium', 'Hair Care'],
    isPromoted: true
  },
  {
    id: 'p2',
    sellerId: 'u2',
    sellerName: 'SkinCare PK',
    sellerAvatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    title: 'CeraVe Hydrating Cleanser',
    description: 'Imported from USA. 100% Authentic. Sealed bottle. Best price in Lahore.',
    price: 3500,
    image: 'https://picsum.photos/600/600?random=202',
    images: ['https://picsum.photos/600/600?random=202'],
    likes: 15,
    category: 'Skin',
    postedAt: '5h ago',
    condition: 'New',
    location: 'Gulberg III, Lahore',
    tags: ['Imported', 'Original']
  },
  {
    id: 'p3',
    sellerId: 'u3',
    sellerName: 'Ali Barber Supply',
    sellerAvatar: 'https://randomuser.me/api/portraits/men/86.jpg',
    title: 'Professional Barber Chair',
    description: 'Heavy duty hydraulic chair. Black leather. Slightly used but good condition. Pickup from Township.',
    price: 25000,
    image: 'https://picsum.photos/600/600?random=203',
    images: ['https://picsum.photos/600/600?random=203', 'https://picsum.photos/600/600?random=2031'],
    likes: 8,
    category: 'Tools',
    postedAt: '1d ago',
    condition: 'Used - Good',
    location: 'Township, Lahore',
    tags: ['Equipment', 'Sale']
  }
];

// --- Components ---

const FilterBar = ({ active, onSelect }: { active: string, onSelect: (c: string) => void }) => {
  const categories = ['All', 'Hair', 'Skin', 'Makeup', 'Tools', 'Fragrance'];
  return (
    <div className="sticky top-16 md:top-0 bg-white z-30 py-3 border-b border-gray-100 shadow-sm">
      <div className="flex gap-2 px-4 overflow-x-auto no-scrollbar">
        <button className="p-2 bg-gray-100 rounded-full text-gray-600 hover:bg-gray-200 transition-colors active:scale-95"><Filter size={18} /></button>
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => onSelect(cat)}
            className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all active:scale-95 ${
              active === cat ? 'bg-primary-600 text-white shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>
    </div>
  );
};

const ProductCard: React.FC<{ product: Product, onClick: () => void }> = ({ product, onClick }) => {
  const [currentImg, setCurrentImg] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const handleNextImg = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (product.images && currentImg < product.images.length - 1) setCurrentImg(c => c + 1);
  };

  const handlePrevImg = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (currentImg > 0) setCurrentImg(c => c - 1);
  };

  return (
    <div onClick={onClick} className="bg-white md:rounded-2xl shadow-sm border-b md:border border-gray-200 hover:shadow-lg transition-shadow overflow-hidden cursor-pointer group mb-4">
      {/* Post Header */}
      <div className="p-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <img src={product.sellerAvatar || `https://ui-avatars.com/api/?name=${product.sellerName}`} className="w-10 h-10 rounded-full object-cover border border-gray-200" alt="Seller" />
          <div>
            <h4 className="font-bold text-sm text-gray-900 leading-none flex items-center gap-1">
              {product.sellerName}
              {product.isPromoted && <span className="text-[10px] bg-gray-100 text-gray-500 px-1 rounded font-normal">Sponsored</span>}
            </h4>
            <span className="text-xs text-gray-500 flex items-center gap-1">
              {product.postedAt} • <MapPin size={10} /> {product.location || 'Lahore'}
            </span>
          </div>
        </div>
        <button className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-50 transition-colors">
          <MoreHorizontal size={20} />
        </button>
      </div>

      {/* Post Content (Text) */}
      <div className="px-4 pb-3">
        <h3 className="font-bold text-gray-900 text-lg mb-1">{product.title}</h3>
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xl font-bold text-primary-600">Rs. {product.price.toLocaleString()}</span>
          {product.condition && <span className="bg-blue-50 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wide">{product.condition}</span>}
        </div>
        <p className="text-sm text-gray-700 leading-relaxed line-clamp-3">{product.description}</p>
        {product.tags && (
          <div className="flex gap-1 mt-2">
            {product.tags.map(tag => <span key={tag} className="text-xs text-primary-600 font-medium">#{tag}</span>)}
          </div>
        )}
      </div>

      {/* Media Carousel */}
      <div className="relative bg-gray-100 aspect-square md:aspect-video w-full group/image">
        <img src={product.images ? product.images[currentImg] : product.image} alt={product.title} className="w-full h-full object-cover" />
        
        {(product.images && product.images.length > 1) && (
          <>
            <button onClick={handlePrevImg} className={`absolute top-1/2 left-2 -translate-y-1/2 bg-black/50 text-white p-1.5 rounded-full hover:bg-black/70 transition-opacity active:scale-90 ${currentImg === 0 ? 'opacity-0' : 'opacity-100'}`}>
               <ChevronLeft size={20} />
            </button>
            <button onClick={handleNextImg} className={`absolute top-1/2 right-2 -translate-y-1/2 bg-black/50 text-white p-1.5 rounded-full hover:bg-black/70 transition-opacity active:scale-90 ${currentImg === (product.images?.length || 0) - 1 ? 'opacity-0' : 'opacity-100'}`}>
               <ChevronRight size={20} />
            </button>
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
              {product.images.map((_, idx) => (
                <div key={idx} className={`w-1.5 h-1.5 rounded-full shadow-sm ${currentImg === idx ? 'bg-white' : 'bg-white/50'}`}></div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Actions Footer */}
      <div className="px-4 py-3 border-t border-gray-100 flex justify-between items-center">
         <div className="flex gap-6">
            <button 
              onClick={(e) => { e.stopPropagation(); setIsLiked(!isLiked); }} 
              className={`flex items-center gap-1.5 text-sm font-bold transition-all active:scale-95 ${isLiked ? 'text-red-500' : 'text-gray-600 hover:text-gray-900'}`}
            >
              <Heart size={22} className={isLiked ? 'fill-red-500' : ''} />
              <span>{product.likes + (isLiked ? 1 : 0)}</span>
            </button>
            <button onClick={(e) => e.stopPropagation()} className="flex items-center gap-1.5 text-gray-600 hover:text-gray-900 text-sm font-bold transition-colors active:scale-95">
              <MessageCircle size={22} />
              <span>Chat</span>
            </button>
            <button onClick={(e) => e.stopPropagation()} className="flex items-center gap-1.5 text-gray-600 hover:text-gray-900 text-sm font-bold transition-colors active:scale-95">
              <Share2 size={22} />
              <span>Share</span>
            </button>
         </div>
         <button 
           onClick={(e) => { e.stopPropagation(); setIsSaved(!isSaved); }}
           className={`transition-colors active:scale-95 ${isSaved ? 'text-primary-600' : 'text-gray-400 hover:text-gray-900'}`}
         >
           <Bookmark size={22} className={isSaved ? 'fill-primary-600 text-primary-600' : ''} />
         </button>
      </div>
    </div>
  );
};

export const MarketplacePage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, currentUser } = useAuth();
  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS);
  const [filter, setFilter] = useState('All');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // --- Create Post Logic ---
  const [newPost, setNewPost] = useState({
    title: '',
    price: '',
    description: '',
    category: 'Tools',
    condition: 'New',
    location: '',
    images: [] as string[]
  });
  const [isGenerating, setIsGenerating] = useState(false);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      // Mock file reading - in real app use FileReader
      const newImages = Array.from(e.target.files).map((file) => URL.createObjectURL(file as Blob));
      setNewPost(prev => ({ ...prev, images: [...prev.images, ...newImages] }));
    }
  };

  const handleRemoveImage = (index: number) => {
    setNewPost(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== index) }));
  };

  const handleGenerateDesc = async () => {
    if (!newPost.title) return;
    setIsGenerating(true);
    const desc = await generateProductDescription(newPost.title, newPost.category);
    setNewPost(prev => ({ ...prev, description: desc }));
    setIsGenerating(false);
  };

  const handleCreatePostClick = () => {
     if (!isAuthenticated) {
        navigate('/login', { state: { from: { pathname: '/marketplace' } } });
        return;
     }
     setIsCreateModalOpen(true);
  }

  const handleSubmitPost = () => {
    if (!newPost.title || !newPost.price || newPost.images.length === 0) return;
    
    const newProduct: Product = {
      id: `new-${Date.now()}`,
      sellerId: currentUser?.id || 'current-user',
      sellerName: currentUser?.name || 'You',
      sellerAvatar: currentUser?.avatar,
      title: newPost.title,
      price: parseInt(newPost.price),
      description: newPost.description,
      category: newPost.category as any,
      condition: newPost.condition as any,
      image: newPost.images[0],
      images: newPost.images,
      likes: 0,
      location: newPost.location || currentUser?.location || 'Lahore',
      postedAt: 'Just now',
      tags: ['New Arrival'],
    };

    setProducts([newProduct, ...products]);
    setIsCreateModalOpen(false);
    // Reset form
    setNewPost({ title: '', price: '', description: '', category: 'Tools', condition: 'New', location: '', images: [] });
  };

  const filteredProducts = filter === 'All' ? products : products.filter(p => p.category === filter);

  return (
    <div className="pt-16 md:pt-0 pb-24 bg-gray-100 min-h-screen relative">
      <div className="md:hidden sticky top-0 z-40 bg-white shadow-sm">
        <div className="px-4 py-3 flex items-center justify-between">
          <h2 className="font-bold text-center w-full">Marketplace</h2>
        </div>
      </div>
      
      <div className="max-w-2xl mx-auto md:pt-24">
        {/* Desktop Create Trigger */}
        <div className="bg-white px-4 py-3 shadow-sm flex items-center gap-3 mb-1 md:rounded-xl md:mb-4">
           <div className="w-10 h-10 bg-gray-200 rounded-full overflow-hidden">
             {isAuthenticated ? (
                <img src={currentUser?.avatar} className="w-full h-full object-cover" alt="Profile" />
             ) : (
                <User size={24} className="text-gray-400 m-2" />
             )}
           </div>
           <div 
             onClick={handleCreatePostClick}
             className="flex-1 bg-gray-100 hover:bg-gray-200 transition-colors rounded-full px-4 py-2.5 text-gray-500 text-sm cursor-pointer"
           >
             What are you selling?
           </div>
           <div className="flex gap-2 text-primary-600">
              <button className="hover:text-primary-700 transition-colors" onClick={handleCreatePostClick}><ImageIcon size={24} /></button>
           </div>
        </div>

        <FilterBar active={filter} onSelect={setFilter} />

        {/* Feed */}
        <div className="md:px-0 md:mt-4">
          {filteredProducts.map(product => (
            <ProductCard key={product.id} product={product} onClick={() => navigate(`/product/${product.id}`)} />
          ))}
          <div className="p-8 text-center">
             <Loader2 className="animate-spin mx-auto text-gray-400 mb-2" size={24} />
             <p className="text-gray-400 text-xs">Loading more items...</p>
          </div>
        </div>
      </div>


      {/* Create Post Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end md:items-center justify-center p-0 md:p-4">
          <div className="bg-white w-full h-[95vh] md:h-auto md:max-h-[90vh] md:max-w-xl rounded-t-2xl md:rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-10">
             
             {/* Modal Header */}
             <div className="px-4 py-3 border-b border-gray-100 flex justify-between items-center">
               <h2 className="font-bold text-lg">Create Listing</h2>
               <button onClick={() => setIsCreateModalOpen(false)} className="bg-gray-100 p-2 rounded-full hover:bg-gray-200 transition-colors active:scale-95">
                 <X size={20} />
               </button>
             </div>

             {/* Scrollable Content */}
             <div className="flex-1 overflow-y-auto p-4 space-y-5">
                
                {/* Image Upload */}
                <div className="space-y-2">
                   <div className="flex gap-3 overflow-x-auto pb-2">
                      <label className="flex-shrink-0 w-24 h-24 border-2 border-dashed border-primary-300 bg-primary-50 rounded-xl flex flex-col items-center justify-center text-primary-600 cursor-pointer hover:bg-primary-100 transition-colors">
                        <Camera size={24} />
                        <span className="text-[10px] font-bold mt-1">Add Photos</span>
                        <input type="file" multiple accept="image/*" className="hidden" onChange={handleImageUpload} />
                      </label>
                      {newPost.images.map((img, idx) => (
                        <div key={idx} className="flex-shrink-0 w-24 h-24 relative group">
                           <img src={img} className="w-full h-full object-cover rounded-xl border border-gray-200" alt="Preview" />
                           <button 
                            onClick={() => handleRemoveImage(idx)}
                            className="absolute top-1 right-1 bg-black/50 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity active:scale-90"
                           >
                             <X size={12} />
                           </button>
                        </div>
                      ))}
                   </div>
                   <p className="text-[10px] text-gray-400">Add up to 6 photos. First photo will be cover.</p>
                </div>

                {/* Inputs */}
                <div className="space-y-4">
                   <div>
                     <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Title*</label>
                     <input 
                       value={newPost.title}
                       onChange={e => setNewPost({...newPost, title: e.target.value})}
                       placeholder="What are you selling?"
                       className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary-500 outline-none"
                     />
                   </div>
                   
                   <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Price (PKR)*</label>
                        <input 
                          type="number"
                          value={newPost.price}
                          onChange={e => setNewPost({...newPost, price: e.target.value})}
                          placeholder="0"
                          className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary-500 outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Condition</label>
                        <select 
                          value={newPost.condition}
                          onChange={e => setNewPost({...newPost, condition: e.target.value})}
                          className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary-500 outline-none"
                        >
                          <option>New</option>
                          <option>Used - Like New</option>
                          <option>Used - Good</option>
                          <option>Used - Fair</option>
                        </select>
                      </div>
                   </div>

                   <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Category</label>
                        <select 
                          value={newPost.category}
                          onChange={e => setNewPost({...newPost, category: e.target.value})}
                          className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary-500 outline-none"
                        >
                          <option>Tools</option>
                          <option>Skin</option>
                          <option>Hair</option>
                          <option>Makeup</option>
                          <option>Fragrance</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Location</label>
                        <input 
                          value={newPost.location}
                          onChange={e => setNewPost({...newPost, location: e.target.value})}
                          placeholder="e.g. DHA Lahore"
                          className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary-500 outline-none"
                        />
                      </div>
                   </div>

                   <div className="relative">
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Description</label>
                      <textarea 
                        value={newPost.description}
                        onChange={e => setNewPost({...newPost, description: e.target.value})}
                        placeholder="Describe your item..."
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary-500 outline-none h-32 resize-none"
                      />
                      <button 
                        onClick={handleGenerateDesc}
                        disabled={!newPost.title || isGenerating}
                        className="absolute bottom-3 right-3 bg-gradient-to-r from-purple-500 to-indigo-500 text-white text-[10px] px-3 py-1.5 rounded-lg font-bold flex items-center gap-1 shadow-md hover:scale-105 transition-transform disabled:opacity-50 active:scale-95"
                      >
                        {isGenerating ? <Loader2 className="animate-spin" size={12} /> : <Sparkles size={12} />}
                        AI Write
                      </button>
                   </div>
                </div>
             </div>

             {/* Modal Footer */}
             <div className="p-4 border-t border-gray-100 bg-white safe-area-pb">
                <button 
                  onClick={handleSubmitPost}
                  disabled={!newPost.title || !newPost.price || newPost.images.length === 0}
                  className="w-full bg-gray-900 text-white font-bold py-3 rounded-xl shadow-lg hover:bg-black transition-all active:scale-95 disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  Post Listing
                </button>
             </div>

          </div>
        </div>
      )}
    </div>
  );
};
