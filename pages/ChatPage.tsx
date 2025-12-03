
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MoreVertical, Send, Image as ImageIcon, Check, CheckCheck, ArrowLeft } from 'lucide-react';
import { Message } from '../types';
import { useAuth } from '../contexts/AuthContext';

const MOCK_MESSAGES: Message[] = [
  { id: 'm1', senderId: 'other', text: 'Hi! Is the Dyson Airwrap still available?', timestamp: '10:30 AM', status: 'read', isMe: false },
  { id: 'm2', senderId: 'me', text: 'Yes, it is available. Used for 3 months only.', timestamp: '10:32 AM', status: 'read', isMe: true },
];

export const ChatPage: React.FC = () => {
  const { threadId } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [messages, setMessages] = useState<Message[]>(MOCK_MESSAGES);
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
     if(!isAuthenticated) {
        navigate('/login', { state: { from: { pathname: `/chat/${threadId}` } } });
     }
  }, [isAuthenticated, navigate, threadId]);

  useEffect(scrollToBottom, [messages]);

  const handleSend = () => {
    if (!inputValue.trim()) return;
    const newMessage: Message = {
      id: `m-${Date.now()}`,
      senderId: 'me',
      text: inputValue,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'sent',
      isMe: true
    };
    setMessages([...messages, newMessage]);
    setInputValue('');
    
    // Simulate reply
    setTimeout(() => {
       const reply: Message = {
         id: `r-${Date.now()}`,
         senderId: 'other',
         text: 'Great! Can you share more pictures?',
         timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
         status: 'sent',
         isMe: false
       };
       setMessages(prev => [...prev, reply]);
    }, 2000);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
       {/* Header */}
       <div className="bg-white px-4 py-3 flex items-center gap-3 shadow-sm border-b border-gray-200 z-10 relative">
          <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-full hover:bg-gray-100">
             <ArrowLeft size={20} />
          </button>
          <div className="relative">
             <img src="https://randomuser.me/api/portraits/women/44.jpg" className="w-10 h-10 rounded-full object-cover" alt="User" />
             <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full"></div>
          </div>
          <div className="flex-1">
             <h3 className="font-bold text-gray-900 text-sm">Zara Ahmed</h3>
             <p className="text-xs text-gray-500">Online</p>
          </div>
          <button className="text-gray-400 hover:bg-gray-100 p-2 rounded-full transition-colors active:scale-95">
             <MoreVertical size={20} />
          </button>
       </div>

       {/* Messages */}
       <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#e5ded8]">
          {messages.map((msg) => (
             <div key={msg.id} className={`flex ${msg.isMe ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[75%] px-4 py-2 rounded-2xl shadow-sm relative ${msg.isMe ? 'bg-primary-600 text-white rounded-br-none' : 'bg-white text-gray-900 rounded-bl-none'}`}>
                   <p className="text-sm leading-relaxed">{msg.text}</p>
                   <div className={`flex items-center justify-end gap-1 mt-1 text-[10px] ${msg.isMe ? 'text-primary-200' : 'text-gray-400'}`}>
                      <span>{msg.timestamp}</span>
                      {msg.isMe && (
                         <span>
                            {msg.status === 'sent' && <Check size={12} />}
                            {msg.status === 'delivered' && <CheckCheck size={12} />}
                            {msg.status === 'read' && <CheckCheck size={12} className="text-blue-300" />}
                         </span>
                      )}
                   </div>
                </div>
             </div>
          ))}
          <div ref={messagesEndRef} />
       </div>

       {/* Input */}
       <div className="bg-white p-3 flex items-center gap-2 border-t border-gray-200 safe-area-pb">
          <button className="text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100 transition-colors active:scale-95">
             <ImageIcon size={24} />
          </button>
          <input 
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type a message..."
            className="flex-1 bg-gray-100 border-none rounded-full px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary-500 outline-none"
          />
          <button 
            onClick={handleSend}
            disabled={!inputValue.trim()}
            className="bg-primary-600 text-white p-3 rounded-full hover:bg-primary-700 disabled:bg-gray-300 transition-colors active:scale-95"
          >
             <Send size={20} />
          </button>
       </div>
    </div>
  );
};
