
import React from 'react';
import { Facebook, Instagram, Twitter, Linkedin, Mail, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 pt-20 pb-10 border-t border-gray-800 mt-auto">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* Column 1: Branding */}
          <div className="space-y-6">
            <Link to="/" className="inline-block">
              <h2 className="text-3xl font-bold font-heading text-white tracking-tight">
                Glow<span className="text-primary-500">Hub</span>
              </h2>
            </Link>
            <p className="text-sm leading-relaxed text-gray-400">
              Pakistan's premier platform revolutionizing beauty and grooming. 
              We connect you with top-tier salons and premium products for a 
              style that defines you.
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="text-white font-bold font-heading text-lg mb-6">Quick Links</h3>
            <ul className="space-y-4 text-sm">
              <li>
                <Link to="/" className="hover:text-primary-400 transition-colors flex items-center gap-2 group">
                  <ArrowRight size={14} className="opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                  Home
                </Link>
              </li>
              <li>
                <Link to="/services" className="hover:text-primary-400 transition-colors flex items-center gap-2 group">
                  <ArrowRight size={14} className="opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                  Services & Salons
                </Link>
              </li>
              <li>
                <Link to="/marketplace" className="hover:text-primary-400 transition-colors flex items-center gap-2 group">
                  <ArrowRight size={14} className="opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                  Shop Products
                </Link>
              </li>
              <li>
                <Link to="/blog" className="hover:text-primary-400 transition-colors flex items-center gap-2 group">
                  <ArrowRight size={14} className="opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                  Latest Blog
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Legal */}
          <div>
            <h3 className="text-white font-bold font-heading text-lg mb-6">Legal</h3>
            <ul className="space-y-4 text-sm">
              <li>
                <Link to="/privacy" className="hover:text-primary-400 transition-colors">Privacy Policy</Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-primary-400 transition-colors">Terms of Service</Link>
              </li>
              <li>
                <Link to="/refunds" className="hover:text-primary-400 transition-colors">Refund Policy</Link>
              </li>
              <li>
                <Link to="/partners" className="hover:text-primary-400 transition-colors">Partner Guidelines</Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Social Media */}
          <div>
            <h3 className="text-white font-bold font-heading text-lg mb-6">Connect With Us</h3>
            <div className="flex gap-4 mb-8">
              <a href="https://facebook.com" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-[#1877F2] hover:text-white transition-all transform hover:-translate-y-1">
                <Facebook size={18} />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-[#E4405F] hover:text-white transition-all transform hover:-translate-y-1">
                <Instagram size={18} />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-black hover:text-white transition-all transform hover:-translate-y-1">
                <Twitter size={18} />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-[#0A66C2] hover:text-white transition-all transform hover:-translate-y-1">
                <Linkedin size={18} />
              </a>
            </div>
            
            <div className="bg-gray-800/50 p-4 rounded-xl border border-gray-800">
              <p className="text-xs font-bold text-gray-500 uppercase mb-2">Support Email</p>
              <a href="mailto:support@glowhub.pk" className="flex items-center gap-2 text-white hover:text-primary-400 transition-colors">
                <Mail size={16} />
                <span>support@glowhub.pk</span>
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-500 font-medium">
            &copy; 2026 GLOW HUB. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-sm text-gray-500">
             <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-green-500"></div> Systems Operational</span>
             <span>v1.2.0</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
