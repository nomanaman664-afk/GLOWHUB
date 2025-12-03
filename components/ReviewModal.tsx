
import React, { useState } from 'react';
import { Star, X } from 'lucide-react';

interface ReviewModalProps {
  bookingId: string;
  salonName: string;
  onClose: () => void;
}

export const ReviewModal: React.FC<ReviewModalProps> = ({ bookingId, salonName, onClose }) => {
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    setSubmitted(true);
    setTimeout(onClose, 1500);
  };

  return (
    <div className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
       <div className="bg-white w-full max-w-sm rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95">
          {submitted ? (
             <div className="p-8 text-center">
                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                   <Star size={32} fill="currentColor" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Thanks for reviewing!</h3>
                <p className="text-sm text-gray-500 mt-2">Your feedback helps others.</p>
             </div>
          ) : (
             <>
                <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                   <h3 className="font-bold text-lg">Rate Experience</h3>
                   <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100"><X size={20} /></button>
                </div>
                <div className="p-6">
                   <p className="text-center text-sm text-gray-500 mb-6">How was your appointment at <br/><span className="font-bold text-gray-900 text-lg">{salonName}</span>?</p>
                   
                   <div className="flex justify-center gap-2 mb-8">
                      {[1, 2, 3, 4, 5].map(star => (
                         <button 
                           key={star}
                           onMouseEnter={() => setRating(star)}
                           onClick={() => setRating(star)}
                           className="transition-transform hover:scale-110"
                         >
                            <Star size={32} className={`${rating >= star ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                         </button>
                      ))}
                   </div>

                   <textarea 
                      value={review}
                      onChange={(e) => setReview(e.target.value)}
                      placeholder="Write your review (optional)..."
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm outline-none focus:border-primary-500 h-24 resize-none mb-4"
                   />

                   <button 
                      onClick={handleSubmit}
                      disabled={rating === 0}
                      className="w-full bg-gray-900 text-white font-bold py-3 rounded-xl shadow-lg hover:bg-black disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                   >
                      Submit Review
                   </button>
                </div>
             </>
          )}
       </div>
    </div>
  );
};
