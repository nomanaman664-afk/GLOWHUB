
import { PaymentMethod, Transaction, PaymentStatus } from '../types';

// Mock in-memory store for simulation
const transactions: Map<string, Transaction> = new Map();

const PLATFORM_COMMISSION_RATE = 0.15; // 15%
const POINTS_EARN_RATE = 0.01; // 1 point per 100 currency units (1%)

export const paymentService = {
  /**
   * Initiates a payment request.
   * Calculates commission and potential loyalty points.
   */
  initiatePayment: async (
    bookingId: string, 
    amount: number, 
    method: PaymentMethod, 
    mobileNumber?: string,
    pointsRedeemed: number = 0
  ): Promise<{ txId: string, message: string, pointsEarned: number }> => {
    
    // Simulate API Latency
    await new Promise(resolve => setTimeout(resolve, 1500));

    const txId = `TX-${Math.floor(Math.random() * 10000000)}`;
    
    // Calculate commission
    const platformFee = Math.round(amount * PLATFORM_COMMISSION_RATE);
    const netPayout = amount - platformFee;
    
    // Calculate points earned (mock: 1 point per 100 PKR)
    const pointsEarned = Math.floor(amount / 100);

    const transaction: Transaction = {
      id: txId,
      bookingId,
      amount,
      currency: 'PKR',
      provider: method,
      status: method === 'CASH' ? 'UNPAID' : 'PENDING_VERIFICATION',
      timestamp: new Date().toISOString(),
      platformFee,
      netPayout
    };

    // Simulate auto-approval for wallets after 5 seconds
    if (method !== 'CASH') {
       setTimeout(() => {
          transaction.status = 'PAID';
          transaction.receiptUrl = `https://receipts.glowhub.pk/${txId}.pdf`;
          transactions.set(txId, transaction);
       }, 5000);
    }

    transactions.set(txId, transaction);

    return {
      txId,
      pointsEarned,
      message: method === 'CASH' 
        ? 'Booking confirmed. Payment due at salon.' 
        : `Payment request sent to ${mobileNumber}. Please check your phone to approve.`
    };
  },

  /**
   * Checks status of a transaction.
   */
  checkStatus: async (txId: string): Promise<PaymentStatus> => {
    const tx = transactions.get(txId);
    return tx ? tx.status : 'FAILED';
  },

  getReceipt: (txId: string) => {
    return transactions.get(txId)?.receiptUrl;
  },

  /**
   * Mock function to get current points balance for a user
   */
  getUserPoints: async (userId: string): Promise<number> => {
      // In real app, fetch from DB
      return 1250; // Mock balance
  }
};
