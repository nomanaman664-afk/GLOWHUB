
import React, { useState, useEffect } from 'react';
import { MapPin, Star, SlidersHorizontal, Navigation, Search, List, Map as MapIcon, ChevronDown, CheckCircle, Clock } from 'lucide-react';
import { Salon, AvailabilityStatus } from '../types';
import { useNavigate } from 'react-router-dom';

// --- Constants & Mock Data Helpers ---

const SORT_OPTIONS = [
  { label: 'Nearest', value: 'nearest' },
  { label: 'Top Rated', value: 'rating' },
  { label: 'Most Booked', value: 'booked' },
  { label: 'Price: Low to High', value: 'price_asc' },
];

const MOCK_NAMES = [
  "The Gentleman's Lounge", "Scissors & Razors", "Glow Studios", "Depilex Men", "Toni & Guy", "Style Station", "Urban Trim", "Luxe Aesthetics"
];

const MOCK_LOCATIONS = [
  { address: "MM Alam Road, Lahore", lat: 31.5204, lng: 74.3587 },
  { address: "DHA Phase 5, Lahore", lat: 31.4697, lng: 74.4111 },
  { address: "Johar Town, Lahore", lat: 31.4697, lng: 74.2728 },
  { address: "Gulberg III, Lahore", lat: 31.5102, lng: 74.3441 },
  { address: "Bahria Town, Lahore", lat: 31.3649, lng: 74.1846 },
];

// Generate salons around a center point
const generateMockSalons = (count: number, userLat: number, userLng: number): Salon[] => {
  return Array.from({ length: count }).map((_, i) => {
    const loc = MOCK_LOCATIONS[i % MOCK_LOCATIONS.length];
    const lat = loc.lat + (Math.random() - 0.5) * 0.04;
    const lng = loc.lng + (Math.random() - 0.5) * 0.04;
    const dist = Math.sqrt(Math.pow(lat - userLat, 2) + Math.pow(lng - userLng, 2)) * 111;
    const statusPool: AvailabilityStatus[] = ['FREE', 'BUSY', 'APPOINTMENT'];
    const status = Math.random() > 0.6 ? 'FREE' : (Math.random() > 0.5 ? 'BUSY' : 'APPOINTMENT');

    return {
      id: `s-${i}`,
      name: MOCK_NAMES[i % MOCK_NAMES.length],
      ownerName: "Manager",
      location: loc.address,
      lat,
      lng,
      distance: parseFloat(dist.toFixed(1)),
      eta: `${Math.ceil(dist * 3 + 5)} mins`,
      rating: parseFloat((3.5 + Math.random() * 1.5).toFixed(1)),
      reviewsCount: Math.floor(Math.random() * 500) + 50,
      image: `https://picsum.photos/400/300?random=${100 + i}`,
      availability: status,
      startingPrice: 1000 + Math.floor(Math.random() * 20) * 100,
      services: [
        { id: 's1', name: 'Signature Haircut', price: 1500, durationMin: 45 },
      ],
      tags: i % 2 === 0 ? ['Premium', 'Unisex'] : ['Men Only', 'Budget']
    };
  });
};

interface FilterState {
  radius: number;
  serviceType: string;
  priceRange: [number, number];
  minRating: number;
  availableNow: boolean;
}

const DEFAULT_FILTERS: FilterState = {
  radius: 15,
  serviceType: 'All',
  priceRange: [0, 10000],
  minRating: 0,
  availableNow: false,
};

interface SalonListItemProps {
  salon: Salon;
}
const SalonListItem: React.FC<SalonListItemProps> = ({ salon }) => {
    const navigate = useNavigate();
    
    const renderStars = (rating: number) => {
        return (
          <div className="flex items-center gap-0.5">
            <Star size={14} className="fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-bold text-gray-700 ml-1">{rating}</span>
          </div>
        );
    };

    const renderAvailability = (status: AvailabilityStatus) => {
        switch (status) {
          case 'FREE':
            return <span className="bg-green-100 text-green-700 text-[10px] font-bold px-2 py-1 rounded-full flex items-center gap-1"><CheckCircle size={10} /> Available Now</span>;
          case 'BUSY':
            return <span className="bg-red-100 text-red-700 text-[10px] font-bold px-2 py-1 rounded-full">Busy</span>;
          default:
            return <span className="bg-gray-100 text-gray-700 text-[10px] font-bold px-2 py-1 rounded-full">On Appointment</span>;
        }
    };
    
    return (
        <div onClick={() => navigate(`/salon/${salon.id}`)} className="bg-white rounded-2xl p-3 border border-gray-100 shadow-sm hover:shadow-lg hover:border-primary-200 transition-all flex gap-4 group cursor-pointer">
            <div className="w-28 h-28 relative flex-shrink-0">
                <img
                    src={salon.image}
                    alt={`Exterior of ${salon.name}`}
                    className="w-full h-full object-cover rounded-xl bg-gray-100"
                    loading="lazy"
                />
                <div className="absolute top-2 left-2">
                    {renderAvailability(salon.availability)}
                </div>
            </div>
            <div className="flex-1 flex flex-col justify-between">
                <div>
                    <div className="flex justify-between items-start">
                        <h3 className="font-bold text-gray-900 leading-tight group-hover:text-primary-600 transition-colors">{salon.name}</h3>
                        {renderStars(salon.rating)}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{salon.location}</p>
                    <div className="flex items-center gap-3 mt-2 text-xs font-medium text-gray-600">
                        <span className="flex items-center gap-1"><MapPin size={12} /> {salon.distance}km</span>
                        <span className="flex items-center gap-1"><Clock size={12} /> {salon.eta}</span>
                    </div>
                </div>
                <div className="flex items-center justify-between mt-3">
                    <div>
                        <p className="text-[10px] text-gray-400 uppercase font-bold">Starts from</p>
                        <p className="text-sm font-bold text-gray-900">Rs. {salon.startingPrice}</p>
                    </div>
                    <button className="bg-primary-600 hover:bg-primary-700 text-white text-sm font-bold px-5 py-2 rounded-lg shadow-lg shadow-primary-200 transition-all hover:-translate-y-0.5 active:scale-95">
                        Book
                    </button>
                </div>
            </div>
        </div>
    );
};


export const ServicesPage: React.FC = () => {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [isLoading, setIsLoading] = useState(true);
  const [allSalons, setAllSalons] = useState<Salon[]>([]);
  const [salons, setSalons] = useState<Salon[]>([]);
  const [userLocation, setUserLocation] = useState<{ lat: number, lng: number } | null>(null);
  const [manualLocation, setManualLocation] = useState('');
  const [sortBy, setSortBy] = useState('nearest');

  // Filters
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<FilterState>(() => {
    const saved = localStorage.getItem('glowhub_filters');
    return saved ? JSON.parse(saved) : DEFAULT_FILTERS;
  });

  // --- Effects ---
  useEffect(() => {
    localStorage.setItem('glowhub_filters', JSON.stringify(filters));
  }, [filters]);

  useEffect(() => {
    const fetchLocationAndData = async () => {
      setIsLoading(true);
      if ("geolocation" in navigator) {
        try {
          const position = await new Promise<GeolocationPosition>((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 5000 });
          });
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        } catch (e) {
          console.log("Location denied, defaulting to Lahore");
          setUserLocation({ lat: 31.5204, lng: 74.3587 });
        }
      } else {
        setUserLocation({ lat: 31.5204, lng: 74.3587 });
      }
    };
    fetchLocationAndData();
  }, []);

  useEffect(() => {
    // If userLocation is null (still fetching), don't fetch data yet
    if (!userLocation) return;
    
    const fetchData = async () => {
      setIsLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const allData = generateMockSalons(15, userLocation.lat, userLocation.lng);
      setAllSalons(allData);

      let data = allData;
      if (filters.availableNow) {
        data = data.filter(s => s.availability === 'FREE');
      }
      data = data.filter(s => s.distance <= filters.radius);
      data = data.filter(s => s.rating >= filters.minRating);
      data.sort((a, b) => {
        if (sortBy === 'nearest') return a.distance - b.distance;
        if (sortBy === 'rating') return b.rating - a.rating;
        if (sortBy === 'price_asc') return a.startingPrice - b.startingPrice;
        if (sortBy === 'booked') return b.reviewsCount - a.reviewsCount;
        return 0;
      });
      setSalons(data);
      setIsLoading(false);
    };
    fetchData();
  }, [userLocation, filters, sortBy]);

  const handleLocateMe = () => {
    setIsLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setManualLocation('Current Location');
      },
      () => alert('Could not access location')
    );
  };

  return (
    <div className="pt-16 md:pt-20 pb-20 min-h-screen flex flex-col md:flex-row relative">
      
      <div className={`flex-1 flex flex-col h-full md:h-[calc(100vh-80px)] md:overflow-y-auto no-scrollbar ${viewMode === 'map' ? 'hidden md:flex' : 'flex'}`}>
        <div className="bg-white sticky top-16 md:top-0 z-20 px-4 py-3 shadow-sm border-b border-gray-100 space-y-3">
          <div className="flex gap-2">
            <div className="flex-1 bg-gray-100 rounded-xl flex items-center px-3 py-2.5 border focus-within:ring-2 ring-primary-500 focus-within:bg-white transition-all">
              <MapPin className="text-primary-600" size={18} />
              <input
                value={manualLocation}
                onChange={(e) => setManualLocation(e.target.value)}
                placeholder="Enter area (e.g. DHA, Gulberg)"
                className="bg-transparent border-none outline-none text-sm font-medium text-gray-900 w-full ml-2 placeholder:text-gray-400"
              />
            </div>
            <button onClick={handleLocateMe} className="bg-gray-100 hover:bg-gray-200 text-gray-600 p-2.5 rounded-xl transition-colors active:scale-95" aria-label="Use my current location">
              <Navigation size={20} />
            </button>
          </div>
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold border whitespace-nowrap transition-all active:scale-95 ${showFilters ? 'bg-gray-900 text-white border-gray-900' : 'bg-white text-gray-700 border-gray-200'}`}
            >
              <SlidersHorizontal size={14} /> Filters
            </button>
            <button
              onClick={() => setFilters(prev => ({ ...prev, availableNow: !prev.availableNow }))}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold border whitespace-nowrap transition-all active:scale-95 ${filters.availableNow ? 'bg-green-600 text-white border-green-600' : 'bg-white text-gray-700 border-gray-200'}`}
            >
              Available Now
            </button>
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none bg-white border border-gray-200 text-gray-700 text-xs font-bold px-4 py-2 pr-8 rounded-full outline-none focus:border-primary-500"
                aria-label="Sort by"
              >
                {SORT_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
              </select>
              <ChevronDown size={12} className="absolute right-3 top-3 text-gray-400 pointer-events-none" />
            </div>
          </div>
          {showFilters && (
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 animate-in slide-in-from-top-2 duration-200">
              <div className="flex justify-between mb-2">
                <h3 className="font-bold text-sm">Refine Search</h3>
                <button onClick={() => setFilters(DEFAULT_FILTERS)} className="text-xs text-primary-600 font-medium hover:underline">Reset</button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-gray-500" htmlFor="radius-range">Radius: {filters.radius}km</label>
                  <input id="radius-range" type="range" min="1" max="50" value={filters.radius} onChange={(e) => setFilters({ ...filters, radius: parseInt(e.target.value) })} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary-600" />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 mb-1 block">Min Rating</label>
                  <div className="flex gap-2">
                    {[3, 4, 4.5].map(r => (
                      <button key={r} onClick={() => setFilters({ ...filters, minRating: r })} className={`px-3 py-1 rounded text-xs font-bold border transition-colors active:scale-95 ${filters.minRating === r ? 'bg-primary-600 text-white border-primary-600' : 'bg-white border-gray-200'}`}>{r}+ Stars</button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="p-4 space-y-4 flex-1">
          {isLoading ? (
            [1, 2, 3, 4].map(n => (
              <div key={n} className="bg-white rounded-2xl p-3 border border-gray-100 shadow-sm flex gap-3 animate-pulse">
                <div className="w-24 h-24 bg-gray-200 rounded-xl"></div>
                <div className="flex-1 space-y-2 py-1">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-8 bg-gray-200 rounded w-full mt-auto"></div>
                </div>
              </div>
            ))
          ) : salons.length > 0 ? (
            salons.map(salon => (
                <SalonListItem key={salon.id} salon={salon} />
            ))
          ) : (
            <div className="text-center py-10 px-4">
              <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                <Search size={32} />
              </div>
              <h3 className="font-bold text-gray-900">No salons found</h3>
              <p className="text-sm text-gray-500 mt-2 mb-6">Your search returned no results. Try adjusting the filters.</p>
              <div className="flex flex-col sm:flex-row justify-center gap-3">
                <button
                  onClick={() => setFilters(prev => ({ ...prev, radius: Math.min(50, prev.radius + 10) }))}
                  className="bg-white border border-gray-200 text-gray-700 font-bold py-2 px-4 rounded-full text-sm hover:bg-gray-50 transition-all active:scale-95"
                >
                  Widen Search to {Math.min(50, filters.radius + 10)}km
                </button>
                {filters.availableNow && (
                  <button
                    onClick={() => setFilters(prev => ({ ...prev, availableNow: false }))}
                    className="bg-white border border-gray-200 text-gray-700 font-bold py-2 px-4 rounded-full text-sm hover:bg-gray-50 transition-all active:scale-95"
                  >
                    Clear "Available Now"
                  </button>
                )}
              </div>

              {allSalons.length > 0 && (
                <div className="mt-12 text-left border-t border-gray-200 pt-8">
                  <h4 className="font-bold text-gray-800 mb-4">Or check out these popular spots</h4>
                  <div className="space-y-4">
                    {allSalons
                      .sort((a, b) => b.rating - a.rating)
                      .slice(0, 3)
                      .map(salon => <SalonListItem key={salon.id} salon={salon} />)
                    }
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className={`md:flex-1 bg-gray-100 relative ${viewMode === 'list' ? 'hidden md:block' : 'block h-screen md:h-auto'}`}>
        <div className="absolute inset-0 bg-[#e5e7eb] overflow-hidden">
          <div className="w-full h-full opacity-10" style={{ backgroundImage: 'radial-gradient(#6b7280 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
            <div className="w-4 h-4 bg-blue-500 border-2 border-white rounded-full shadow-lg animate-pulse"></div>
            <div className="w-12 h-12 bg-blue-500 rounded-full opacity-20 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
          </div>
          {userLocation && !isLoading && salons.map((salon, index) => {
            // Mock projection logic for demo
            const latDiff = (salon.lat - userLocation.lat) * 3000;
            const lngDiff = (salon.lng - userLocation.lng) * 3000;
            return (
              <div
                key={salon.id}
                onClick={() => navigate(`/salon/${salon.id}`)}
                className="absolute transition-all duration-500 group cursor-pointer"
                style={{ top: `calc(50% - ${latDiff}px)`, left: `calc(50% + ${lngDiff}px)` }}
              >
                <div className={`relative flex flex-col items-center ${salon.availability === 'FREE' ? 'z-20' : 'z-10'}`}>
                  <div className={`px-2 py-1 bg-white rounded shadow-md text-[10px] font-bold whitespace-nowrap mb-1 opacity-0 group-hover:opacity-100 transition-opacity ${index < 3 ? 'opacity-100' : ''}`}>
                    {salon.name}
                  </div>
                  <MapPin size={32} className={`fill-current drop-shadow-md transition-transform hover:scale-110 ${salon.availability === 'FREE' ? 'text-green-600' : salon.availability === 'BUSY' ? 'text-red-500' : 'text-gray-600'}`} />
                </div>
              </div>
            );
          })}
        </div>
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur p-2 rounded-lg shadow-md text-xs space-y-1">
          <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-green-600"></div> Available</div>
          <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-gray-600"></div> Appointment</div>
          <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-red-500"></div> Busy</div>
        </div>
      </div>

      <div className="md:hidden fixed bottom-24 left-1/2 transform -translate-x-1/2 z-30">
        <button
          onClick={() => setViewMode(viewMode === 'list' ? 'map' : 'list')}
          className="bg-gray-900 text-white px-6 py-3 rounded-full shadow-xl flex items-center gap-2 font-bold transition-transform active:scale-95"
        >
          {viewMode === 'list' ? <><MapIcon size={18} /> Map View</> : <><List size={18} /> List View</>}
        </button>
      </div>
    </div>
  );
};
