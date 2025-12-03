
import React, { useState, useEffect, useRef } from 'react';
import { X, Calendar, Clock, ChevronLeft, ChevronRight, CheckCircle, User, Scissors, AlertCircle, Calendar as CalendarIcon, CreditCard, ShieldCheck, Loader2, Smartphone, LogIn, TrendingUp, Gift } from 'lucide-react';
import { Salon, TimeSlot, PaymentMethod, PaymentStatus } from '../types';
import { paymentService } from '../services/paymentService';
import { bookingService } from '../services/bookingService';
import { useModalTrap } from '../hooks/useModalTrap';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';


interface BookingFlowProps {
  salon: Salon;
  initialServiceId: string | null;
  onClose: () => void;
}

export const BookingFlow: React.FC<BookingFlowProps> = ({ salon, initialServiceId, onClose }) => {
  const { isAuthenticated, currentUser } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState(1); // 1: Service, 2: Date, 3: Review, 4: Success
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  // Selection State
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(initialServiceId);
  const [selectedStaffId, setSelectedStaffId] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);
  
  // Review & Payment State
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('CASH');
  const [mobileNumber, setMobileNumber] = useState('');
  const [promoCode, setPromoCode] = useState('');
  
  // Loyalty Points
  const [availablePoints, setAvailablePoints] = useState(0);
  const [redeemPoints, setRedeemPoints] = useState(false);
  const [pointsEarned, setPointsEarned] = useState(0);

  const [bookingResult, setBookingResult] = useState<{id: string; txId?: string; paymentStatus?: PaymentStatus} | null>(null);
  
  // Payment Processing State
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus | 'IDLE'>('IDLE');

  // Accessibility: Modal Focus Trap
  const modalRef = useRef<HTMLDivElement>(null);
  useModalTrap(modalRef, true, onClose);


  // Computed
  const selectedService = salon.services.find(s => s.id === selectedServiceId);
  const selectedStaff = salon.staff?.find(s => s.id === selectedStaffId);

  // Effect: Fetch Slots when Date or Staff changes (Step 2)
  useEffect(() => {
    if (step === 2) {
      setLoading(true);
      setAvailableSlots([]); 
      bookingService.fetchAvailableSlots(salon.id, selectedDate.toISOString(), selectedStaffId)
        .then(slots => {
          setAvailableSlots(slots);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [step, selectedDate, selectedStaffId, salon.id]);

  // Effect: Fetch User Points (Step 3)
  useEffect(() => {
    if (step === 3 && currentUser) {
        paymentService.getUserPoints(currentUser.id).then(setAvailablePoints);
    }
  }, [step, currentUser]);

  const handleProcessBooking = async () => {
    if (!selectedSlot) return;
    setLoading(true);
    setApiError(null);
    setIsProcessingPayment(true);

    try {
      // 1. Calculate Amount with possible Peak Pricing and Loyalty
      let price = selectedService?.price || 0;
      if (selectedSlot.isPeak) {
          price = Math.round(price * 1.2); // 20% surge
      }
      
      // Loyalty Discount: 1 point = 1 PKR (Mock)
      const loyaltyDiscount = redeemPoints ? Math.min(availablePoints, price) : 0;
      const promoDiscount = promoCode.toUpperCase() === 'GLOW10' ? Math.round(price * 0.1) : 0;
      const finalPrice = Math.max(0, price - promoDiscount - loyaltyDiscount);

      // 2. Initiate Payment (Mock)
      const paymentInit = await paymentService.initiatePayment(
        'TEMP_BK_ID', 
        finalPrice, 
        paymentMethod, 
        mobileNumber,
        loyaltyDiscount
      );
      
      setPointsEarned(paymentInit.pointsEarned);

      // 3. If Wallet, Poll for status
      if (paymentMethod !== 'CASH' && finalPrice > 0) {
        setPaymentStatus('PENDING_VERIFICATION');
        
        let attempts = 0;
        const pollInterval = setInterval(async () => {
          attempts++;
          const status = await paymentService.checkStatus(paymentInit.txId);
          
          if (status === 'PAID') {
            clearInterval(pollInterval);
            finalizeBooking(status, paymentInit.txId, finalPrice, loyaltyDiscount, paymentInit.pointsEarned);
          } else if (attempts > 10) {
            clearInterval(pollInterval);
            setApiError("Payment timed out. Please try again.");
            setIsProcessingPayment(false);
            setPaymentStatus('FAILED');
            setLoading(false);
          }
        }, 1000);
      } else {
        // Cash flow or Full Redemption
        const status = finalPrice === 0 ? 'PAID' : 'UNPAID';
        finalizeBooking(status, paymentInit.txId, finalPrice, loyaltyDiscount, paymentInit.pointsEarned);
      }

    } catch (err: any) {
      setApiError(err.message || "Booking failed");
      setLoading(false);
      setIsProcessingPayment(false);
    }
  };

  const finalizeBooking = async (payStatus: PaymentStatus, txId: string, finalPrice: number, pointsUsed: number, pointsGained: number) => {
    try {
      const response = await bookingService.confirmBooking({
        salonName: salon.name,
        serviceName: selectedService?.name || 'Service',
        staffName: selectedStaff?.name || 'Any Staff',
        date: selectedDate.toISOString(),
        time: selectedSlot?.time,
        price: finalPrice,
        paymentMethod,
        transactionId: txId,
        pointsRedeemed: pointsUsed,
        pointsEarned: pointsGained
      });
      
      setBookingResult({
        id: response.id,
        txId: txId,
        paymentStatus: payStatus
      });
      
      setIsProcessingPayment(false);
      setLoading(false);
      setStep(4); // Success
    } catch (e) {
       setApiError("Failed to confirm booking details.");
       setLoading(false);
    }
  };

  const getNextDays = () => Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return d;
  });

  const calculateTotal = () => {
      let price = selectedService?.price || 0;
      if (selectedSlot?.isPeak) price = Math.round(price * 1.2);
      const promoDiscount = promoCode.toUpperCase() === 'GLOW10' ? Math.round(price * 0.1) : 0;
      const loyaltyDiscount = redeemPoints ? Math.min(availablePoints, price) : 0;
      return Math.max(0, price - promoDiscount - loyaltyDiscount);
  }

  const canProceed = () => {
    if (step === 1) return !!selectedServiceId;
    if (step === 2) return !!selectedSlot;
    if (step === 3) {
      if (paymentMethod !== 'CASH' && calculateTotal() > 0 && mobileNumber.length < 11) return false;
      return true;
    }
    return false;
  };

  const nextStep = () => {
    if (canProceed()) setStep(s => s + 1);
  };

  const prevStep = () => {
    if (step > 1) setStep(s => s - 1);
  };

  if (!isAuthenticated) {
     return (
        <div className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
           <div className="bg-white rounded-3xl p-8 max-w-sm w-full text-center relative animate-in zoom-in-95">
              <button onClick={onClose} className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full"><X size={20}/></button>
              <div className="w-16 h-16 bg-primary-50 rounded-full flex items-center justify-center mx-auto mb-4 text-primary-600">
                 <User size={32} />
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Login Required</h2>
              <p className="text-gray-500 mb-6 text-sm">Please login or create an account to book appointments.</p>
              <button onClick={() => navigate('/login', { state: { from: window.location } })} className="w-full bg-primary-600 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-primary-700 transition-colors">
                 <LogIn size={18} /> Login to Continue
              </button>
           </div>
        </div>
     )
  }

  return (
    <div className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm flex items-end md:items-center justify-center p-0 md:p-4">
      <div 
        ref={modalRef}
        className="bg-white w-full md:max-w-lg h-[90vh] md:h-auto md:max-h-[85vh] rounded-t-3xl md:rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-10 duration-300">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-white sticky top-0 z-10">
          <div className="flex items-center gap-2">
            {step > 1 && step < 4 && !isProcessingPayment && (
              <button onClick={prevStep} className="p-2 -ml-2 hover:bg-gray-100 rounded-full">
                <ChevronLeft size={20} />
              </button>
            )}
            <h2 className="font-bold text-lg">
              {step === 1 && "Select Service"}
              {step === 2 && "Date & Time"}
              {step === 3 && "Review & Pay"}
              {step === 4 && "Booking Confirmed"}
            </h2>
          </div>
          {!isProcessingPayment && (
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full bg-gray-50">
              <X size={20} />
            </button>
          )}
        </div>

        {/* Progress Bar */}
        {step < 4 && (
          <div className="w-full bg-gray-100 h-1">
            <div 
              className="bg-primary-600 h-1 transition-all duration-500 ease-out" 
              style={{ width: `${(step / 3) * 100}%` }}
            ></div>
          </div>
        )}

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6 bg-white relative">
          
          {/* STEP 1 & 2 Omitted for brevity (same as previous) */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-xs font-bold text-gray-400 uppercase mb-3 tracking-wider">Services</h3>
                <div className="space-y-3">
                  {salon.services.map(service => (
                    <div 
                      key={service.id}
                      onClick={() => setSelectedServiceId(service.id)}
                      className={`border rounded-xl p-4 flex items-center justify-between cursor-pointer transition-all ${
                        selectedServiceId === service.id 
                          ? 'border-primary-600 bg-primary-50 ring-1 ring-primary-600' 
                          : 'border-gray-100 hover:border-gray-200'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${selectedServiceId === service.id ? 'bg-primary-200 text-primary-700' : 'bg-gray-100 text-gray-500'}`}>
                          <Scissors size={18} />
                        </div>
                        <div>
                          <p className={`font-bold text-sm ${selectedServiceId === service.id ? 'text-primary-900' : 'text-gray-900'}`}>{service.name}</p>
                          <p className="text-xs text-gray-500">{service.durationMin} mins</p>
                        </div>
                      </div>
                      <span className="font-bold text-primary-600">Rs. {service.price}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
             <div className="space-y-6">
               <h3 className="text-xs font-bold text-gray-400 uppercase mb-3 tracking-wider">Select Date</h3>
                <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2 -mx-2 px-2">
                  {getNextDays().map((date, idx) => (
                      <button
                        key={idx}
                        onClick={() => { setSelectedDate(date); setSelectedSlot(null); }}
                        className={`min-w-[4.5rem] p-3 rounded-2xl border flex flex-col items-center justify-center transition-all ${
                          date.toDateString() === selectedDate.toDateString()
                            ? 'bg-gray-900 text-white border-gray-900 shadow-lg scale-105' 
                            : 'bg-white text-gray-400 border-gray-100'
                        }`}
                      >
                        <span className="text-[10px] font-bold uppercase tracking-widest">{date.toLocaleDateString('en-US', { weekday: 'short' })}</span>
                        <span className="text-xl font-bold mt-1">{date.getDate()}</span>
                      </button>
                    ))}
                </div>
                <div>
                    <h3 className="text-xs font-bold text-gray-400 uppercase mb-3 tracking-wider">Available Slots</h3>
                     {loading ? (
                        <div className="grid grid-cols-3 gap-3">
                            {[1,2,3,4,5,6].map(i => <div key={i} className="h-10 bg-gray-100 rounded-lg animate-pulse"></div>)}
                        </div>
                     ) : availableSlots.length > 0 ? (
                        <div className="grid grid-cols-3 gap-3">
                            {availableSlots.map(slot => (
                                <button
                                    key={slot.id}
                                    disabled={!slot.available}
                                    onClick={() => setSelectedSlot(slot)}
                                    className={`py-2 px-1 rounded-lg text-xs font-bold border transition-all relative ${
                                    !slot.available
                                        ? 'bg-gray-50 text-gray-300 border-gray-100 cursor-not-allowed line-through decoration-gray-300'
                                        : selectedSlot?.id === slot.id
                                        ? 'bg-primary-600 text-white border-primary-600 shadow-md transform scale-105'
                                        : 'bg-white text-gray-700 border-gray-200 hover:border-primary-300 hover:bg-primary-50'
                                    }`}
                                >
                                    {slot.time}
                                    {slot.isPeak && slot.available && <span className="absolute -top-1 -right-1 w-2 h-2 bg-yellow-400 rounded-full"></span>}
                                </button>
                            ))}
                        </div>
                     ) : <p className="text-center text-sm text-gray-400 py-4">No slots available</p>}
                </div>
             </div>
          )}

          {/* --- STEP 3: Review & Pay --- */}
          {step === 3 && (
            <div className="space-y-6">
              
              {/* Summary Card */}
              <div className="bg-gray-50 p-5 rounded-2xl border border-gray-100 relative overflow-hidden">
                <div className="relative z-10 space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Service</span>
                    <span className="font-bold text-gray-900 text-right">{selectedService?.name}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Date</span>
                    <span className="font-bold text-gray-900">
                      {selectedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} • {selectedSlot?.time}
                    </span>
                  </div>
                  
                  {selectedSlot?.isPeak && (
                      <div className="flex justify-between text-sm bg-yellow-50 p-1 rounded">
                        <span className="text-yellow-700 font-bold flex items-center gap-1"><TrendingUp size={12}/> Peak Hour</span>
                        <span className="text-yellow-700 font-bold">+20%</span>
                      </div>
                  )}

                   {/* Loyalty Redemption */}
                   {availablePoints > 0 && (
                      <div className="bg-primary-50 p-3 rounded-lg border border-primary-100 flex items-center justify-between">
                         <div className="flex items-center gap-2">
                            <Gift size={16} className="text-primary-600" />
                            <div>
                               <p className="text-xs font-bold text-primary-800">Use Points</p>
                               <p className="text-[10px] text-primary-600">Balance: {availablePoints}</p>
                            </div>
                         </div>
                         <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" checked={redeemPoints} onChange={() => setRedeemPoints(!redeemPoints)} className="sr-only peer"/>
                            <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary-600"></div>
                         </label>
                      </div>
                   )}

                  <div className="h-px bg-gray-200 my-2"></div>
                  <div className="flex justify-between items-end">
                    <span className="text-gray-900 font-bold">Total</span>
                    <div className="text-right">
                      {redeemPoints && <span className="block text-xs text-green-600 line-through">Rs. {(selectedService?.price || 0)}</span>}
                      <span className="text-xl font-bold text-primary-600">Rs. {calculateTotal()}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Method Selection */}
              {calculateTotal() > 0 && (
                <div>
                    <h3 className="text-xs font-bold text-gray-400 uppercase mb-3 tracking-wider">Payment Method</h3>
                    <div className="space-y-3">
                    {['CASH', 'JAZZCASH', 'EASYPAISA', 'CARD'].map((method) => (
                        <div
                        key={method}
                        onClick={() => setPaymentMethod(method as PaymentMethod)}
                        className={`border p-4 rounded-xl flex items-center justify-between cursor-pointer transition-all ${
                            paymentMethod === method ? 'border-primary-600 bg-primary-50 ring-1 ring-primary-600' : 'border-gray-200 bg-white'
                        }`}
                        >
                        <div className="flex items-center gap-3">
                            <span className="font-bold text-sm capitalize">{method.toLowerCase().replace('card', 'Credit/Debit Card')}</span>
                        </div>
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === method ? 'border-primary-600' : 'border-gray-300'}`}>
                            {paymentMethod === method && <div className="w-2.5 h-2.5 bg-primary-600 rounded-full"></div>}
                        </div>
                        </div>
                    ))}
                    </div>
                </div>
              )}

              {/* Mobile Number for Wallets */}
              {calculateTotal() > 0 && paymentMethod !== 'CASH' && paymentMethod !== 'CARD' && (
                <div className="animate-in slide-in-from-top-2">
                   <label className="text-xs font-bold text-gray-400 uppercase mb-2 block tracking-wider" htmlFor="mobile-number">Mobile Number</label>
                   <div className="flex items-center bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus-within:border-primary-500 focus-within:bg-white transition-all">
                      <Smartphone size={18} className="text-gray-400 mr-2"/>
                      <span className="text-sm font-bold text-gray-500 mr-1">+92</span>
                      <input 
                        id="mobile-number"
                        type="tel"
                        value={mobileNumber}
                        onChange={(e) => setMobileNumber(e.target.value.replace(/\D/g,'').slice(0,10))}
                        placeholder="300 1234567"
                        className="flex-1 bg-transparent outline-none text-sm font-medium"
                      />
                   </div>
                </div>
              )}
            </div>
          )}

          {/* Payment Processing Overlay */}
          {isProcessingPayment && (
            <div className="absolute inset-0 bg-white/90 backdrop-blur-sm z-20 flex flex-col items-center justify-center text-center p-6">
               <div className="w-16 h-16 relative mb-6">
                  <div className="absolute inset-0 border-4 border-gray-200 rounded-full"></div>
                  <div className="absolute inset-0 border-4 border-primary-600 rounded-full border-t-transparent animate-spin"></div>
               </div>
               <h3 className="text-xl font-bold text-gray-900 mb-2">Processing Payment</h3>
               <p className="text-sm text-gray-500 max-w-xs">
                  {paymentMethod === 'CASH' || calculateTotal() === 0 ? 'Confirming your booking...' : `Please check your phone (${mobileNumber}) to approve.`}
               </p>
            </div>
          )}

          {/* --- STEP 4: Success --- */}
          {step === 4 && (
            <div className="h-full flex flex-col items-center justify-center text-center animate-in zoom-in-95 duration-300 py-6">
              <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mb-6 relative">
                 <div className="absolute inset-0 bg-green-100 rounded-full animate-ping opacity-25"></div>
                 <CheckCircle size={48} className="text-green-500 relative z-10" />
              </div>
              
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Booking Confirmed!</h2>
              {pointsEarned > 0 && (
                  <div className="bg-primary-50 text-primary-700 px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2 mb-4">
                      <Gift size={16} /> You earned {pointsEarned} points!
                  </div>
              )}

              <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4 w-full mb-6">
                 <div className="flex justify-between items-center mb-2">
                   <span className="text-xs text-gray-500 uppercase font-bold">Booking ID</span>
                   <span className="text-sm font-mono font-bold bg-white px-2 py-1 rounded border border-gray-200">{bookingResult?.id}</span>
                 </div>
                 <div className="flex items-center gap-3 border-t border-gray-200 pt-3">
                    <div className="bg-white p-2 rounded-lg border border-gray-200 shadow-sm text-center min-w-[3.5rem]">
                      <span className="block text-[10px] font-bold text-red-500 uppercase">{selectedDate.toLocaleDateString('en-US', {month:'short'})}</span>
                      <span className="block text-lg font-bold text-gray-900 leading-none">{selectedDate.getDate()}</span>
                    </div>
                    <div className="text-left">
                      <span className="block font-bold text-gray-900">{selectedSlot?.time}</span>
                    </div>
                 </div>
              </div>

              <button className="w-full bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-bold py-3 rounded-xl text-sm flex items-center justify-center gap-2 mb-4 transition-colors">
                <CalendarIcon size={18} /> Add to Calendar
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        {step < 4 && (
          <div className="p-4 bg-white border-t border-gray-100 safe-area-pb">
            <button
              onClick={step === 3 ? handleProcessBooking : nextStep}
              disabled={!canProceed() || loading || isProcessingPayment}
              className={`w-full font-bold py-3.5 rounded-xl shadow-lg flex items-center justify-center gap-2 transition-all active:scale-95 ${
                !canProceed() || loading || isProcessingPayment
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                  : 'bg-gray-900 text-white hover:bg-black'
              }`}
            >
              {!loading && (
                step === 3 ? `Pay Rs. ${calculateTotal()}` : 'Continue'
              )}
              {!loading && <ChevronRight size={18} />}
            </button>
          </div>
        )}
        
        {step === 4 && (
           <div className="p-4 bg-white border-t border-gray-100 safe-area-pb">
             <button onClick={onClose} className="w-full bg-gray-900 text-white font-bold py-3.5 rounded-xl shadow-lg hover:bg-black transition-colors">
               Done
             </button>
           </div>
        )}

      </div>
    </div>
  );
};
