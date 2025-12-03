
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, TrendingUp, Monitor, Layout, Download, Eye, Smartphone, Tablet } from 'lucide-react';

// --- Dummy Data ---

const VISITORS_DATA = Array.from({ length: 30 }, (_, i) => ({
  day: i + 1,
  value: 120 + Math.floor(Math.random() * 200) + (i * 10) + (i % 7 === 0 ? 100 : 0) // Upward trend with spikes
}));

const TOP_PAGES_DATA = [
  { page: 'Home Page', path: '/', visits: 12540, change: '+12%' },
  { page: 'Marketplace', path: '/marketplace', visits: 8920, change: '+8%' },
  { page: 'Services', path: '/services', visits: 6450, change: '+15%' },
  { page: 'Barber Dashboard', path: '/dashboard/barber', visits: 3200, change: '+2%' },
  { page: 'User Profile', path: '/profile', visits: 2100, change: '-1%' },
];

const DEVICE_DATA = [
  { type: 'Mobile', value: 58, color: '#7B3FE4', icon: Smartphone },
  { type: 'Desktop', value: 32, color: '#1A73E8', icon: Monitor },
  { type: 'Tablet', value: 10, color: '#FFCA28', icon: Tablet },
];

// --- Components ---

const LineChart = ({ data }: { data: { day: number; value: number }[] }) => {
  const max = Math.max(...data.map(d => d.value)) * 1.1;
  const min = Math.min(...data.map(d => d.value)) * 0.8;
  const range = max - min;
  
  const points = data.map((d, i) => {
    const x = (i / (data.length - 1)) * 100;
    const y = 100 - ((d.value - min) / range) * 100;
    return `${x},${y}`;
  }).join(' ');

  const [hoveredPoint, setHoveredPoint] = useState<{ x: number, y: number, value: number, day: number } | null>(null);

  return (
    <div className="relative w-full h-64 group">
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full overflow-visible">
        {/* Grid Lines */}
        {[0, 25, 50, 75, 100].map(p => (
          <line key={p} x1="0" y1={p} x2="100" y2={p} stroke="#f3f4f6" strokeWidth="0.5" vectorEffect="non-scaling-stroke" />
        ))}
        
        <defs>
          <linearGradient id="lineGradient" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#7B3FE4" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#7B3FE4" stopOpacity="0" />
          </linearGradient>
        </defs>
        
        {/* Area Fill */}
        <path 
          d={`M0,100 L0,${100 - ((data[0].value - min) / range) * 100} ${points.split(' ').map(p => 'L'+p).join(' ')} L100,100 Z`} 
          fill="url(#lineGradient)" 
        />
        
        {/* Line */}
        <polyline 
          fill="none" 
          stroke="#7B3FE4" 
          strokeWidth="3" 
          points={points} 
          vectorEffect="non-scaling-stroke"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Hover Points (Invisible trigger areas) */}
        {data.map((d, i) => {
           const x = (i / (data.length - 1)) * 100;
           const y = 100 - ((d.value - min) / range) * 100;
           return (
             <rect 
               key={i} 
               x={x - 1} 
               y="0" 
               width="2" 
               height="100" 
               fill="transparent" 
               onMouseEnter={() => setHoveredPoint({ x, y, value: d.value, day: d.day })}
               onMouseLeave={() => setHoveredPoint(null)}
               className="cursor-crosshair"
             />
           );
        })}

        {/* Active Point Indicator */}
        {hoveredPoint && (
          <circle 
            cx={hoveredPoint.x} 
            cy={hoveredPoint.y} 
            r="4" 
            fill="#fff" 
            stroke="#7B3FE4" 
            strokeWidth="2" 
            vectorEffect="non-scaling-stroke"
          />
        )}
      </svg>
      
      {/* Tooltip */}
      {hoveredPoint && (
        <div 
          className="absolute bg-gray-900 text-white text-xs font-bold px-3 py-2 rounded-lg pointer-events-none shadow-xl -translate-x-1/2 -translate-y-full mb-2 z-10 whitespace-nowrap"
          style={{ left: `${hoveredPoint.x}%`, top: `${hoveredPoint.y}%` }}
        >
          Day {hoveredPoint.day}: {hoveredPoint.value} Visitors
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1 w-2 h-2 bg-gray-900 rotate-45"></div>
        </div>
      )}

      {/* X Axis Labels */}
      <div className="flex justify-between mt-2 text-xs text-gray-400 font-medium px-1">
        <span>Day 1</span>
        <span>Day 15</span>
        <span>Day 30</span>
      </div>
    </div>
  );
};

const BarChart = ({ data }: { data: typeof TOP_PAGES_DATA }) => {
  const max = Math.max(...data.map(d => d.visits));

  return (
    <div className="space-y-4">
      {data.map((item, i) => (
        <div key={item.path} className="group">
          <div className="flex justify-between text-sm mb-1.5">
             <div className="flex items-center gap-2">
                <span className="font-bold text-gray-700 w-4">{i + 1}.</span>
                <span className="font-medium text-gray-900 group-hover:text-primary-600 transition-colors">{item.page}</span>
                <span className="text-xs text-gray-400 font-mono hidden sm:inline-block">{item.path}</span>
             </div>
             <div className="flex items-center gap-3">
               <span className="text-xs font-bold text-green-600 bg-green-50 px-1.5 py-0.5 rounded">{item.change}</span>
               <span className="font-bold text-gray-900 w-16 text-right">{item.visits.toLocaleString()}</span>
             </div>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
            <div 
              className="h-full bg-secondary-500 rounded-full transition-all duration-1000 ease-out group-hover:bg-primary-600"
              style={{ width: `${(item.visits / max) * 100}%` }}
            ></div>
          </div>
        </div>
      ))}
    </div>
  );
};

const DonutChart = ({ data }: { data: typeof DEVICE_DATA }) => {
  // Create conic gradient string
  let cumulative = 0;
  const gradient = data.map(d => {
    const start = cumulative;
    cumulative += d.value;
    return `${d.color} ${start}% ${cumulative}%`;
  }).join(', ');

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-48 h-48 rounded-full mb-6 shadow-xl" style={{ background: `conic-gradient(${gradient})` }}>
         {/* Inner Circle for Donut Effect */}
         <div className="absolute inset-4 bg-white rounded-full flex flex-col items-center justify-center shadow-inner">
            <span className="text-3xl font-bold text-gray-900">100%</span>
            <span className="text-xs text-gray-500 font-medium uppercase tracking-wider">Traffic</span>
         </div>
      </div>
      
      <div className="flex gap-4 sm:gap-8 justify-center w-full">
        {data.map(d => (
          <div key={d.type} className="flex flex-col items-center text-center">
             <div className="flex items-center gap-1.5 mb-1">
               <div className="w-3 h-3 rounded-full" style={{ backgroundColor: d.color }}></div>
               <span className="text-xs font-bold text-gray-500">{d.type}</span>
             </div>
             <div className="flex items-center gap-1">
               <d.icon size={16} className="text-gray-400" />
               <span className="text-lg font-bold text-gray-900">{d.value}%</span>
             </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const ProgressDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [timeRange, setTimeRange] = useState('30d');

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
           <div>
              <button 
                onClick={() => navigate('/admin')} 
                className="flex items-center gap-2 text-gray-500 hover:text-gray-900 mb-2 transition-colors font-medium text-sm"
              >
                <ArrowLeft size={16} /> Back to Admin
              </button>
              <h1 className="text-3xl font-bold text-gray-900">Performance Dashboard</h1>
              <p className="text-gray-500 mt-1">Real-time insights for {new Date().toLocaleDateString()}</p>
           </div>
           
           <div className="flex items-center gap-3 bg-white p-1 rounded-xl border border-gray-200 shadow-sm">
              {['7d', '30d', '90d'].map(range => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                    timeRange === range 
                      ? 'bg-gray-900 text-white shadow-md' 
                      : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  Last {range.toUpperCase()}
                </button>
              ))}
              <div className="w-px h-6 bg-gray-200 mx-1"></div>
              <button className="p-2 text-gray-500 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors">
                 <Download size={20} />
              </button>
           </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
           {/* Chart 1: Visitors Trend */}
           <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 lg:col-span-2">
              <div className="flex justify-between items-center mb-6">
                 <div>
                    <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                       <TrendingUp size={20} className="text-primary-600" /> Daily Visitors Trend
                    </h2>
                    <p className="text-sm text-gray-500">Unique visitors per day</p>
                 </div>
                 <div className="text-right">
                    <p className="text-2xl font-bold text-gray-900">14,205</p>
                    <p className="text-xs font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded inline-block">+12.5% vs last period</p>
                 </div>
              </div>
              <LineChart data={VISITORS_DATA} />
           </div>

           {/* Chart 3: Device Breakdown */}
           <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col">
              <div className="mb-6">
                 <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <Monitor size={20} className="text-secondary-500" /> Device Breakdown
                 </h2>
                 <p className="text-sm text-gray-500">User sessions by device type</p>
              </div>
              <div className="flex-1 flex items-center justify-center">
                 <DonutChart data={DEVICE_DATA} />
              </div>
           </div>
        </div>

        {/* Chart 2: Popular Pages (Full Width) */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
           <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
               <div>
                  <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                     <Layout size={20} className="text-accent-500" /> Top 5 Popular Pages
                  </h2>
                  <p className="text-sm text-gray-500">Most visited pages by engagement</p>
               </div>
               <button className="text-sm font-bold text-primary-600 hover:text-primary-700 flex items-center gap-1 border border-primary-100 px-4 py-2 rounded-lg hover:bg-primary-50 transition-colors">
                  <Eye size={16} /> View All Pages
               </button>
           </div>
           <BarChart data={TOP_PAGES_DATA} />
        </div>

      </div>
    </div>
  );
};
