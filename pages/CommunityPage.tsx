
import React from 'react';
import { Users, MessageSquare, Heart } from 'lucide-react';

export const CommunityPage: React.FC = () => {
  return (
    <div className="pt-24 pb-24 px-6 max-w-4xl mx-auto flex flex-col items-center justify-center min-h-[60vh] text-center animate-in fade-in">
      <div className="w-24 h-24 bg-primary-50 rounded-full flex items-center justify-center mb-6 text-primary-600 relative">
        <Users size={40} />
        <div className="absolute top-0 right-0 bg-secondary-100 p-2 rounded-full">
            <MessageSquare size={16} className="text-secondary-600" />
        </div>
      </div>
      <h1 className="text-4xl font-bold text-gray-900 mb-4">Community & Reviews</h1>
      <p className="text-gray-500 text-lg max-w-lg mb-8">
        Connect with other beauty enthusiasts, share your salon experiences, and discover trending styles.
      </p>
      
      <div className="grid md:grid-cols-3 gap-6 w-full text-left">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <h3 className="font-bold text-gray-900 mb-2">Trend Discussions</h3>
            <p className="text-sm text-gray-500">Join conversations about the latest haircuts and skincare routines.</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <h3 className="font-bold text-gray-900 mb-2">Expert Q&A</h3>
            <p className="text-sm text-gray-500">Get advice directly from top-rated barbers and beauticians.</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <h3 className="font-bold text-gray-900 mb-2">Style Showcase</h3>
            <p className="text-sm text-gray-500">Post your fresh looks and get feedback from the community.</p>
        </div>
      </div>
      
      <div className="mt-12 bg-gray-50 px-6 py-3 rounded-full text-sm font-medium text-gray-500">
         Feature coming soon!
      </div>
    </div>
  );
};
