
export enum UserRole {
  CUSTOMER = 'CUSTOMER',
  BARBER = 'BARBER', 
  SALON_OWNER = 'SALON_OWNER', // New: Dedicated Salon Owner Role
  SELLER = 'SELLER',
  ADMIN = 'ADMIN'
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: UserRole;
  location: string;
  password?: string;
  cnic?: string;
  isVerified?: boolean;
  loyaltyPoints?: number; // New: Track user rewards
}

export interface Service {
  id: string;
  name: string;
  price: number;
  durationMin: number;
  category?: string;
}

export type AvailabilityStatus = 'FREE' | 'BUSY' | 'APPOINTMENT';

export interface Review {
  id: string;
  authorName: string;
  rating: number;
  text: string;
  date: string;
}

export interface Staff {
  id: string;
  name: string;
  role: string;
  image: string;
  available: boolean;
  workingHours?: { start: string; end: string }; // e.g. "09:00", "17:00"
}

export interface ShopSettings {
  openingTime: string; // "09:00"
  closingTime: string; // "21:00"
  slotDurationMin: number; // 30, 45, 60
  bufferTimeMin: number; // 5, 10, 15
  dynamicPricingEnabled: boolean;
  peakHourMultiplier: number; // 1.1, 1.2
}

export interface Salon {
  id: string;
  name: string;
  ownerName: string;
  location: string;
  lat: number;
  lng: number;
  distance: number;
  eta: string;
  rating: number;
  reviewsCount: number;
  image: string;
  coverImage?: string;
  availability: AvailabilityStatus;
  startingPrice: number;
  services: Service[];
  tags: string[];
  about?: string;
  gallery?: string[];
  reviews?: Review[];
  staff?: Staff[];
  isVerified?: boolean;
  phone?: string;
  settings?: ShopSettings; // Owner settings
}

export interface Product {
  id: string;
  sellerId: string;
  sellerName: string;
  sellerAvatar?: string;
  sellerRating?: number;
  title: string;
  description: string;
  price: number;
  image: string;
  images?: string[];
  likes: number;
  category: 'Hair' | 'Skin' | 'Makeup' | 'Tools' | 'Fragrance';
  condition?: 'New' | 'Used - Like New' | 'Used - Good' | 'Used - Fair';
  specs?: Record<string, string>;
  deliveryOptions?: string[];
  postedAt: string;
  location?: string;
  tags?: string[];
  isPromoted?: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

// --- Booking & Payment Types ---

export type PaymentMethod = 'CASH' | 'JAZZCASH' | 'EASYPAISA' | 'CARD';
export type PaymentStatus = 'PAID' | 'UNPAID' | 'PENDING_VERIFICATION' | 'FAILED';

export interface TimeSlot {
  id: string;
  time: string; // "10:00 AM"
  available: boolean;
  isPeak?: boolean;
  isBreak?: boolean;
}

export interface Transaction {
  id: string;
  bookingId: string;
  amount: number;
  currency: string; // 'PKR', 'USD'
  provider: PaymentMethod;
  status: PaymentStatus;
  timestamp: string;
  receiptUrl?: string;
  platformFee: number; // Commission amount
  netPayout: number; // Amount to owner
}

export interface Booking {
  id: string;
  salonName: string;
  serviceName: string;
  staffName: string;
  date: string;
  time: string;
  price: number;
  paymentMethod: PaymentMethod;
  status: 'CONFIRMED' | 'PENDING' | 'CANCELLED';
  paymentStatus?: PaymentStatus;
  transactionId?: string;
  mobileNumber?: string;
  pointsEarned?: number; // Loyalty points gained
  pointsRedeemed?: number; // Loyalty points used
}

// --- Dashboard & Order Types ---

export interface Order {
  id: string;
  productTitle: string;
  price: number;
  date: string;
  status: 'SHIPPED' | 'DELIVERED' | 'PROCESSING';
  image: string;
}

export interface EarningReport {
  period: string;
  grossAmount: number;
  platformFees: number;
  netEarnings: number;
  trend: number;
}

// --- Chat & Notification Types ---

export interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
  status: 'sent' | 'delivered' | 'read';
  isMe: boolean;
  image?: string;
}

export interface ChatThread {
  id: string;
  participantName: string;
  participantAvatar: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  isOnline: boolean;
  type: 'BUYING' | 'BOOKING';
  contextId?: string;
  contextTitle?: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  isRead: boolean;
  type: 'booking' | 'promo' | 'system';
}

// --- Admin Types ---

export type ApprovalStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'MORE_DOCS';
export type RequestType = 'SALON' | 'SELLER';

export interface ApprovalRequest {
  id: string;
  type: RequestType;
  businessName: string;
  ownerName: string;
  cnic: string;
  location: string;
  submittedAt: string;
  status: ApprovalStatus;
  documents: string[];
  shopImages?: string[];
  sampleProducts?: string[];
  rejectionReason?: string;
}

export interface AdminAnalytics {
  dau: number;
  bookingsToday: number;
  gmv: number;
  refundRate: number;
  pendingApprovals: number;
  topCities: { city: string; count: number }[];
  topBarbers: { name: string; bookings: number }[];
  topProducts: { title: string; sales: number }[];
}
