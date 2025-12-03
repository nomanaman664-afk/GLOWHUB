
import { TimeSlot, Booking, Salon } from '../types';

// Mock database of bookings to track availability
let MOCK_BOOKINGS_DB: Booking[] = [];

// Helper to check if a slot intersects with existing bookings
const isSlotBooked = (date: string, time: string, staffId: string | null) => {
  return MOCK_BOOKINGS_DB.some(b => 
    b.date === date && 
    b.time === time && 
    (!staffId || b.staffName === staffId) // simplified check
  );
};

export const bookingService = {
  /**
   * Generates time slots based on salon settings and existing bookings.
   * Simulates a real backend algorithm.
   */
  fetchAvailableSlots: async (
    salonId: string, 
    date: string, 
    staffId: string | null
  ): Promise<TimeSlot[]> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 600));

    // Default salon hours: 10 AM to 9 PM
    const startHour = 10;
    const endHour = 21;
    const slots: TimeSlot[] = [];

    // Parse selected date to check if it's in the past
    const selectedDateObj = new Date(date);
    const now = new Date();
    const isToday = selectedDateObj.getDate() === now.getDate() && 
                    selectedDateObj.getMonth() === now.getMonth();

    for (let h = startHour; h < endHour; h++) {
      // Create slots for hour (e.g. 10:00) and half-hour (10:30) if using 30m slots
      // For MVP, assuming 1-hour slots to keep it simple
      const ampm = h >= 12 ? 'PM' : 'AM';
      const hour12 = h % 12 || 12;
      const timeStr = `${hour12.toString().padStart(2, '0')}:00 ${ampm}`;

      // Check for breaks (Mock: 1 PM - 2 PM is break)
      const isBreak = h === 13; 

      // Check if booked
      // In a real app, we'd check against specific staff availability
      const booked = isSlotBooked(date, timeStr, staffId);

      // Check if time is in the past (if today)
      let pastTime = false;
      if (isToday) {
        if (h <= now.getHours()) pastTime = true;
      }

      // Peak pricing logic (Mock: 5 PM - 8 PM)
      const isPeak = h >= 17 && h <= 20;

      slots.push({
        id: `slot-${date}-${h}`,
        time: timeStr,
        available: !booked && !isBreak && !pastTime,
        isBreak,
        isPeak
      });
    }

    return slots;
  },

  confirmBooking: async (bookingData: Partial<Booking>): Promise<Booking> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newBooking: Booking = {
      id: `BK-${Math.floor(10000 + Math.random() * 90000)}`,
      status: 'CONFIRMED',
      paymentStatus: 'UNPAID', // Default
      ...bookingData as Booking
    };

    MOCK_BOOKINGS_DB.push(newBooking);
    return newBooking;
  },

  cancelBooking: async (bookingId: string): Promise<boolean> => {
    await new Promise(resolve => setTimeout(resolve, 800));
    MOCK_BOOKINGS_DB = MOCK_BOOKINGS_DB.filter(b => b.id !== bookingId);
    return true;
  }
};
