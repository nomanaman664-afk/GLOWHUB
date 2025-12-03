
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  CheckSquare, 
  Users, 
  DollarSign, 
  TrendingUp, 
  Download, 
  Search, 
  Filter, 
  CheckCircle, 
  XCircle, 
  FileText, 
  MapPin, 
  AlertCircle,
  Calendar,
  ArrowLeft,
  ArrowRight
} from 'lucide-react';
import { ApprovalRequest, AdminAnalytics, ApprovalStatus, UserRole } from '../types';
import { useAuth } from '../contexts/AuthContext';

// --- Mock Data Generators ---

const generateAnalytics = (): AdminAnalytics => ({
  dau: 1450,
  bookingsToday: 324,
  gmv: 850000, // PKR
  refundRate: 1.2,
  pendingApprovals: 2,
  topCities: [
    { city: 'Lahore', count: 450 },
    { city: 'Karachi', count: 380 },
    { city: 'Islamabad', count: 210 },
    { city: 'Faisalabad', count: 120 },
  ],
  topBarbers: [
    { name: "The Gentleman's Lounge", bookings: 85 },
    { name: "Depilex Men", bookings: 72 },
    { name: "Toni & Guy", bookings: 64 },
  ],
  topProducts: [
    { title: "CeraVe Cleanser", sales: 142 },
    { title: "Dyson Airwrap (Used)", sales: 18 },
    { title: "Beard Oil Organic", sales: 95 }
  ]
});

const generateRequests = (): ApprovalRequest[] => [
  {
    id: 'REQ-101',
    type: 'SALON',
    businessName: 'Luxe Cuts DHA',
    ownerName: 'Kamran Akmal',
    cnic: '35202-1234567-1',
    location: 'DHA Phase 6, Lahore',
    submittedAt: '2023-10-25',
    status: 'PENDING',
    documents: ['https://picsum.photos/400/600?random=doc1'],
    shopImages: ['https://picsum.photos/400/300?random=shop1', 'https://picsum.photos/400/300?random=shop2'],
  },
  {
    id: 'REQ-102',
    type: 'SELLER',
    businessName: 'Beauty Bargains PK',
    ownerName: 'Sana Mir',
    cnic: '35201-9876543-2',
    location: 'Gulberg III, Lahore',
    submittedAt: '2023-10-26',
    status: 'PENDING',
    documents: ['https://picsum.photos/400/600?random=doc2'],
    sampleProducts: ['https://picsum.photos/400/300?random=prod1', 'https://picsum.photos/400/300?random=prod2']
  },
  {
    id: 'REQ-103',
    type: 'SALON',
    businessName: 'Urban Trim',
    ownerName: 'Bilal Khan',
    cnic: '35202-5555555-5',
    location: 'F-7 Markaz, Islamabad',
    submittedAt: '2023-10-24',
    status: 'APPROVED',
    documents: [],
    shopImages: []
  }
];

export const AdminPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { userRole, isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'approvals'>('dashboard');
  const [analytics, setAnalytics] = useState<AdminAnalytics | null>(null);
  const [requests, setRequests] = useState<ApprovalRequest[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<ApprovalRequest | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);

  // Simple auth check redirection
  useEffect(() => {
     if (isAuthenticated && userRole !== UserRole.ADMIN) {
        navigate('/profile');
     }
  }, [isAuthenticated, userRole, navigate]);

  const canGoBack = location.key !== 'default';

  // --- Load Data ---
  useEffect(() => {
    setTimeout(() => {
      setAnalytics(generateAnalytics());
      setRequests(generateRequests());
    }, 800);
  }, []);

  // --- Handlers ---
  const handleApprove = (id: string) => {
    setRequests(prev => prev.map(r => r.id === id ? { ...r, status: 'APPROVED' as ApprovalStatus } : r));
    setSelectedRequest(null);
  };

  const handleReject = () => {
    if (!selectedRequest || !rejectReason) return;
    setRequests(prev => prev.map(r => r.id === selectedRequest.id ? { ...r, status: 'REJECTED' as ApprovalStatus, rejectionReason: rejectReason } : r));
    setIsRejectModalOpen(false);
    setSelectedRequest(null);
    setRejectReason('');
  };

  const handleExportCSV = () => {
    if (!analytics) return;
    const csvContent = `Metric,Value\nDAU,${analytics.dau}\nBookings,${analytics.bookingsToday}\nGMV,${analytics.gmv}\nRefund Rate,${analytics.refundRate}%\n`;
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'glowhub_analytics.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col md:flex-row font-sans text-gray-900">
      
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-slate-900 text-slate-300 flex-shrink-0 md:h-screen sticky top-0 z-40">
        <div 
          onClick={() => navigate('/')}
          className="p-6 border-b border-slate-800 cursor-pointer hover:bg-slate-800 transition-colors"
        >
          <h1 className="text-xl font-bold text-white tracking-tight">GlowHub <span className="text-primary-500">Admin</span></h1>
        </div>
        <nav className="p-4 space-y-2">
          <button 
            onClick={() => setActiveTab('dashboard')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${activeTab === 'dashboard' ? 'bg-primary-600 text-white shadow-lg shadow-primary-900/50' : 'hover:bg-slate-800'}`}
          >
            <LayoutDashboard size={20} />
            <span className="font-medium">Dashboard</span>
          </button>
          <button 
            onClick={() => setActiveTab('approvals')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${activeTab === 'approvals' ? 'bg-primary-600 text-white shadow-lg shadow-primary-900/50' : 'hover:bg-slate-800'}`}
          >
            <CheckSquare size={20} />
            <div className="flex-1 text-left flex justify-between items-center">
              <span className="font-medium">Approvals</span>
              {analytics && analytics.pendingApprovals > 0 && (
                <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                  {analytics.pendingApprovals}
                </span>
              )}
            </div>
          </button>
          
          <button 
            onClick={() => navigate('/progress-dashboard')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors hover:bg-slate-800 text-slate-300`}
          >
            <TrendingUp size={20} />
            <span className="font-medium">Analytics</span>
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto relative">
        
        {/* --- DASHBOARD VIEW --- */}
        {activeTab === 'dashboard' && analytics && (
          <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => navigate(-1)}
                    disabled={!canGoBack}
                    className="p-2 rounded-full bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ArrowLeft size={20} />
                  </button>
                  <button
                    onClick={() => navigate(1)}
                    className="p-2 rounded-full bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
                  >
                    <ArrowRight size={20} />
                  </button>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Overview</h2>
                  <p className="text-gray-500 text-sm">Track platform performance and growth.</p>
                </div>
              </div>
              <div className="flex gap-3">
                <button className="bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-gray-50">
                   <Calendar size={16} /> Last 30 Days
                </button>
                <button 
                  onClick={handleExportCSV}
                  className="bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-black"
                >
                   <Download size={16} /> Export CSV
                </button>
              </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex justify-between items-start mb-4">
                  <div className="bg-blue-100 p-3 rounded-xl text-blue-600"><Users size={20} /></div>
                  <span className="text-green-600 text-xs font-bold bg-green-50 px-2 py-1 rounded-full">+12%</span>
                </div>
                <p className="text-gray-500 text-xs font-bold uppercase tracking-wider">Active Users</p>
                <p className="text-3xl font-bold text-gray-900">{analytics.dau.toLocaleString()}</p>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex justify-between items-start mb-4">
                  <div className="bg-purple-100 p-3 rounded-xl text-purple-600"><CheckSquare size={20} /></div>
                  <span className="text-green-600 text-xs font-bold bg-green-50 px-2 py-1 rounded-full">+5%</span>
                </div>
                <p className="text-gray-500 text-xs font-bold uppercase tracking-wider">Bookings Today</p>
                <p className="text-3xl font-bold text-gray-900">{analytics.bookingsToday}</p>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex justify-between items-start mb-4">
                  <div className="bg-green-100 p-3 rounded-xl text-green-600"><DollarSign size={20} /></div>
                  <span className="text-green-600 text-xs font-bold bg-green-50 px-2 py-1 rounded-full">+8%</span>
                </div>
                <p className="text-gray-500 text-xs font-bold uppercase tracking-wider">GMV (PKR)</p>
                <p className="text-3xl font-bold text-gray-900">{analytics.gmv.toLocaleString()}</p>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex justify-between items-start mb-4">
                  <div className="bg-orange-100 p-3 rounded-xl text-orange-600"><AlertCircle size={20} /></div>
                  <span className="text-red-600 text-xs font-bold bg-red-50 px-2 py-1 rounded-full">-2%</span>
                </div>
                <p className="text-gray-500 text-xs font-bold uppercase tracking-wider">Refund Rate</p>
                <p className="text-3xl font-bold text-gray-900">{analytics.refundRate}%</p>
              </div>
            </div>

            {/* Charts Area */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
               {/* Top Cities */}
               <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 lg:col-span-3">
                  <h3 className="font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <MapPin size={18} className="text-primary-600"/> Top Performing Cities
                  </h3>
                  <div className="space-y-4">
                    {analytics.topCities.map((city, idx) => (
                      <div key={city.city}>
                        <div className="flex justify-between text-sm font-medium mb-1">
                           <span>{city.city}</span>
                           <span className="text-gray-500">{city.count} Bookings</span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-2">
                           <div 
                              className="bg-primary-600 h-2 rounded-full" 
                              style={{ width: `${(city.count / analytics.topCities[0].count) * 100}%` }}
                           ></div>
                        </div>
                      </div>
                    ))}
                  </div>
               </div>
               
               {/* Top Barbers */}
               <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 lg:col-span-2">
                  <h3 className="font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <CheckCircle size={18} className="text-green-600"/> Top Salons
                  </h3>
                  <div className="space-y-4">
                     {analytics.topBarbers.map((barber, i) => (
                        <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                           <span className="font-bold text-sm text-gray-700">{barber.name}</span>
                           <span className="text-xs font-bold bg-white border border-gray-200 px-2 py-1 rounded text-gray-600">{barber.bookings} Bkgs</span>
                        </div>
                     ))}
                  </div>
                  <button onClick={() => navigate('/progress-dashboard')} className="w-full mt-4 text-center text-primary-600 font-bold text-sm hover:underline">
                     View detailed reports
                  </button>
               </div>
            </div>
          </div>
        )}

        {/* --- APPROVALS VIEW --- */}
        {activeTab === 'approvals' && (
          <div className="space-y-6 animate-in fade-in duration-500">
             <div className="flex justify-between items-center">
               <h2 className="text-2xl font-bold text-gray-900">Pending Approvals</h2>
               <div className="flex gap-2">
                  <button className="p-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50"><Filter size={18} /></button>
                  <button className="p-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50"><Search size={18} /></button>
               </div>
             </div>

             <div className="space-y-4">
                {requests.filter(r => r.status === 'PENDING').length === 0 && (
                   <div className="text-center py-12 bg-white rounded-2xl border border-gray-100">
                      <CheckCircle size={48} className="mx-auto text-green-200 mb-4" />
                      <p className="text-gray-400">All caught up! No pending requests.</p>
                   </div>
                )}
                {requests.filter(r => r.status === 'PENDING').map(req => (
                   <div key={req.id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start mb-4">
                         <div className="flex items-center gap-4">
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-white ${req.type === 'SALON' ? 'bg-primary-600' : 'bg-secondary-500'}`}>
                               {req.type === 'SALON' ? 'SA' : 'SE'}
                            </div>
                            <div>
                               <h3 className="font-bold text-lg text-gray-900">{req.businessName}</h3>
                               <p className="text-sm text-gray-500">{req.ownerName} • {req.location}</p>
                            </div>
                         </div>
                         <span className="text-xs font-bold bg-orange-100 text-orange-600 px-3 py-1 rounded-full">{req.status}</span>
                      </div>
                      
                      <div className="grid md:grid-cols-2 gap-4 mb-6">
                         <div className="bg-gray-50 p-3 rounded-xl">
                            <p className="text-xs text-gray-400 uppercase font-bold mb-1">CNIC</p>
                            <p className="font-mono text-sm font-medium">{req.cnic}</p>
                         </div>
                         <div className="bg-gray-50 p-3 rounded-xl">
                            <p className="text-xs text-gray-400 uppercase font-bold mb-1">Submitted</p>
                            <p className="text-sm font-medium">{req.submittedAt}</p>
                         </div>
                      </div>

                      <div className="flex gap-3 pt-4 border-t border-gray-100">
                         <button 
                           onClick={() => setSelectedRequest(req)} 
                           className="flex-1 bg-white border border-gray-200 text-gray-700 font-bold py-2.5 rounded-xl hover:bg-gray-50"
                         >
                            Review Details
                         </button>
                         <button 
                           onClick={() => handleApprove(req.id)}
                           className="flex-1 bg-green-600 text-white font-bold py-2.5 rounded-xl hover:bg-green-700"
                         >
                            Approve
                         </button>
                      </div>
                   </div>
                ))}
             </div>
          </div>
        )}

      </main>

      {/* Detail Modal */}
      {selectedRequest && !isRejectModalOpen && (
         <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-2xl max-h-[90vh] rounded-3xl overflow-hidden flex flex-col animate-in zoom-in-95">
               <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                  <h3 className="font-bold text-xl">Review Application</h3>
                  <button onClick={() => setSelectedRequest(null)} className="p-2 hover:bg-gray-200 rounded-full"><XCircle size={24} /></button>
               </div>
               <div className="p-6 overflow-y-auto">
                  <h4 className="font-bold text-gray-900 mb-4">Documents</h4>
                  <div className="grid grid-cols-2 gap-4 mb-6">
                     {selectedRequest.documents.map((doc, i) => (
                        <div key={i} className="border border-gray-200 rounded-xl p-2 cursor-pointer hover:border-primary-500">
                           <img src={doc} alt="Doc" className="w-full h-40 object-cover rounded-lg" />
                           <p className="text-xs text-center mt-2 font-bold text-gray-500 flex items-center justify-center gap-1"><FileText size={12}/> Document {i+1}</p>
                        </div>
                     ))}
                  </div>
                  
                  <h4 className="font-bold text-gray-900 mb-4">Store Images</h4>
                  <div className="flex gap-4 overflow-x-auto pb-2">
                     {(selectedRequest.shopImages || selectedRequest.sampleProducts)?.map((img, i) => (
                        <img key={i} src={img} alt="Store" className="w-40 h-40 object-cover rounded-xl bg-gray-100" />
                     ))}
                  </div>
               </div>
               <div className="p-6 border-t border-gray-100 bg-white flex gap-4">
                  <button 
                    onClick={() => setIsRejectModalOpen(true)}
                    className="flex-1 bg-red-50 text-red-600 font-bold py-3 rounded-xl hover:bg-red-100"
                  >
                     Reject
                  </button>
                  <button 
                    onClick={() => handleApprove(selectedRequest.id)}
                    className="flex-1 bg-green-600 text-white font-bold py-3 rounded-xl hover:bg-green-700 shadow-lg shadow-green-200"
                  >
                     Approve Application
                  </button>
               </div>
            </div>
         </div>
      )}

      {/* Reject Modal */}
      {isRejectModalOpen && (
         <div className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-sm rounded-3xl p-6 animate-in zoom-in-95">
               <h3 className="font-bold text-lg mb-4 text-red-600">Reject Application</h3>
               <p className="text-sm text-gray-600 mb-4">Please provide a reason for rejection. This will be sent to the applicant.</p>
               <textarea 
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm h-32 mb-4 focus:ring-2 focus:ring-red-500 outline-none"
                  placeholder="Reason for rejection..."
               ></textarea>
               <div className="flex gap-3">
                  <button 
                    onClick={() => setIsRejectModalOpen(false)}
                    className="flex-1 bg-gray-100 text-gray-700 font-bold py-3 rounded-xl hover:bg-gray-200"
                  >
                     Cancel
                  </button>
                  <button 
                    onClick={handleReject}
                    disabled={!rejectReason}
                    className="flex-1 bg-red-600 text-white font-bold py-3 rounded-xl hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                  >
                     Confirm Reject
                  </button>
               </div>
            </div>
         </div>
      )}

    </div>
  );
};
