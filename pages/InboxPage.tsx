
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageCircle, Bell, ChevronRight, LogIn } from 'lucide-react';
import { ChatThread } from '../types';
import { useAuth } from '../contexts/AuthContext';

const MOCK_THREADS: ChatThread[] = [
  {
    id: 't1',
    participantName: 'Zara Ahmed',
    participantAvatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    lastMessage: 'Is the Dyson Airwrap still available?',
    lastMessageTime: '10:30 AM',
    unreadCount: 2,
    isOnline: true,
    type: 'BUYING',
    contextTitle: 'Dyson Airwrap Complete'
  },
  {
    id: 't2',
    participantName: 'The Gentleman\'s Lounge',
    participantAvatar: 'https://picsum.photos/200/200?random=1',
    lastMessage: 'See you tomorrow at 5 PM!',
    lastMessageTime: 'Yesterday',
    unreadCount: 0,
    isOnline: false,
    type: 'BOOKING',
    contextTitle: 'Appointment #BK-8821'
  }
];

export const InboxPage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState<'messages' | 'notifications'>('messages');

  if (!isAuthenticated) {
     return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4">
           <MessageCircle size={48} className="text-gray-300 mb-4" />
           <h2 className="text-xl font-bold text-gray-900 mb-2">Please Login</h2>
           <p className="text-gray-500 text-center mb-6">You need to be logged in to view your messages.</p>
           <button onClick={() => navigate('/login')} className="bg-primary-600 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2">
              <LogIn size={20} /> Login Now
           </button>
        </div>
     )
  }

  return (
    <div className="pt-16 md:pt-20 pb-24 max-w-2xl mx-auto min-h-screen bg-white md:bg-gray-50 md:pt-24 relative">
       
       <div className="bg-white md:rounded-2xl md:shadow-sm md:border md:border-gray-100 overflow-hidden">
         <div className="flex border-b border-gray-100">
            <button 
              onClick={() => setActiveTab('messages')}
              className={`flex-1 py-4 font-bold text-sm flex items-center justify-center gap-2 transition-colors relative ${activeTab === 'messages' ? 'text-primary-600' : 'text-gray-500 hover:text-primary-500'}`}
            >
              <MessageCircle size={18} /> Messages
              {activeTab === 'messages' && <div className="absolute bottom-0 w-full h-0.5 bg-primary-600"></div>}
            </button>
            <button 
              onClick={() => setActiveTab('notifications')}
              className={`flex-1 py-4 font-bold text-sm flex items-center justify-center gap-2 transition-colors relative ${activeTab === 'notifications' ? 'text-primary-600' : 'text-gray-500 hover:text-primary-500'}`}
            >
              <Bell size={18} /> Notifications
              {activeTab === 'notifications' && <div className="absolute bottom-0 w-full h-0.5 bg-primary-600"></div>}
            </button>
         </div>

         <div className="min-h-[60vh]">
            {activeTab === 'messages' && (
              <div>
                {MOCK_THREADS.map(thread => (
                  <div 
                    key={thread.id} 
                    onClick={() => navigate(`/chat/${thread.id}`)}
                    className="p-4 border-b border-gray-50 hover:bg-gray-50 cursor-pointer transition-colors flex gap-4 active:bg-gray-100"
                  >
                    <div className="relative">
                       <img src={thread.participantAvatar} alt={thread.participantName} className="w-12 h-12 rounded-full object-cover bg-gray-200" />
                       {thread.isOnline && <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>}
                    </div>
                    <div className="flex-1 min-w-0">
                       <div className="flex justify-between items-baseline mb-1">
                          <h3 className="font-bold text-gray-900 text-sm truncate">{thread.participantName}</h3>
                          <span className="text-xs text-gray-400 whitespace-nowrap ml-2">{thread.lastMessageTime}</span>
                       </div>
                       <p className={`text-sm truncate mb-1 ${thread.unreadCount > 0 ? 'font-bold text-gray-900' : 'text-gray-500'}`}>{thread.lastMessage}</p>
                       {thread.contextTitle && (
                         <span className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full truncate max-w-full inline-block">
                           {thread.type === 'BUYING' ? '🛍️' : '✂️'} {thread.contextTitle}
                         </span>
                       )}
                    </div>
                    {thread.unreadCount > 0 && (
                      <div className="flex items-center">
                         <div className="w-5 h-5 bg-primary-600 rounded-full flex items-center justify-center text-[10px] font-bold text-white">
                           {thread.unreadCount}
                         </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="p-8 text-center text-gray-400">
                 <Bell size={32} className="mx-auto mb-2 opacity-20" />
                 <p className="text-sm">No new notifications</p>
              </div>
            )}
         </div>
       </div>
    </div>
  );
};
