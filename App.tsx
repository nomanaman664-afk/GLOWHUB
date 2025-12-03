
import React, { Suspense, lazy } from 'react';
import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { AIAssistant } from './components/AIAssistant';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { UserRole } from './types';
import { CartProvider } from './contexts/CartContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { CartDrawer } from './components/CartDrawer';

const ScrollToTop = () => {
  const { pathname } = useLocation();
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

// --- Performance: Code Splitting with React.lazy ---
const HomePage = lazy(() => import('./pages/HomePage').then(module => ({ default: module.HomePage })));
const ServicesPage = lazy(() => import('./pages/ServicesPage').then(module => ({ default: module.ServicesPage })));
const SalonProfilePage = lazy(() => import('./pages/SalonProfilePage').then(module => ({ default: module.SalonProfilePage })));
const MarketplacePage = lazy(() => import('./pages/MarketplacePage').then(module => ({ default: module.MarketplacePage })));
const ProductDetailPage = lazy(() => import('./pages/ProductDetailPage').then(module => ({ default: module.ProductDetailPage })));
const ProfilePage = lazy(() => import('./pages/ProfilePage').then(module => ({ default: module.ProfilePage })));
const UserDashboardPage = lazy(() => import('./pages/UserDashboardPage').then(module => ({ default: module.UserDashboardPage })));
const BarberDashboardPage = lazy(() => import('./pages/BarberDashboardPage').then(module => ({ default: module.BarberDashboardPage })));
const SalonDashboardPage = lazy(() => import('./pages/SalonDashboardPage').then(module => ({ default: module.SalonDashboardPage })));
const InboxPage = lazy(() => import('./pages/InboxPage').then(module => ({ default: module.InboxPage })));
const ChatPage = lazy(() => import('./pages/ChatPage').then(module => ({ default: module.ChatPage })));
const AdminPage = lazy(() => import('./pages/AdminPage').then(module => ({ default: module.AdminPage })));
const DesignSystemPage = lazy(() => import('./pages/DesignSystemPage').then(module => ({ default: module.DesignSystemPage })));
const LoginPage = lazy(() => import('./pages/LoginPage').then(module => ({ default: module.LoginPage })));
const SignupPage = lazy(() => import('./pages/SignupPage').then(module => ({ default: module.SignupPage })));
const CommunityPage = lazy(() => import('./pages/CommunityPage').then(module => ({ default: module.CommunityPage })));
const ProgressDashboardPage = lazy(() => import('./pages/ProgressDashboardPage').then(module => ({ default: module.ProgressDashboardPage })));

const LoadingFallback = () => (
  <div className="flex justify-center items-center h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
  </div>
);

const App: React.FC = () => {
  return (
    <AuthProvider>
      <CartProvider>
        <NotificationProvider>
          <Router>
            <ScrollToTop />
            <div className="min-h-screen flex flex-col bg-gray-50 text-gray-900 font-sans selection:bg-primary-100 selection:text-primary-900">
              <Navbar />
              <CartDrawer />
              
              {/* Accessibility: Main Content Landmark */}
              <main id="main-content" className="flex-1">
                <Suspense fallback={<LoadingFallback />}>
                  <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={<HomePage />} />
                    <Route path="/services" element={<ServicesPage />} />
                    <Route path="/salon/:id" element={<SalonProfilePage />} />
                    <Route path="/marketplace" element={<MarketplacePage />} />
                    <Route path="/product/:id" element={<ProductDetailPage />} />
                    <Route path="/community" element={<CommunityPage />} />
                    <Route path="/design-system" element={<DesignSystemPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/signup" element={<SignupPage />} />

                    {/* Protected Routes */}
                    <Route path="/profile" element={
                      <ProtectedRoute>
                        <ProfilePage />
                      </ProtectedRoute>
                    } />
                    <Route path="/dashboard/user" element={
                      <ProtectedRoute allowedRoles={[UserRole.CUSTOMER, UserRole.SELLER, UserRole.ADMIN]}>
                        <UserDashboardPage />
                      </ProtectedRoute>
                    } />
                    <Route path="/dashboard/barber" element={
                      <ProtectedRoute allowedRoles={[UserRole.BARBER, UserRole.ADMIN]}>
                        <BarberDashboardPage />
                      </ProtectedRoute>
                    } />
                    <Route path="/dashboard/salon" element={
                      <ProtectedRoute allowedRoles={[UserRole.SALON_OWNER, UserRole.ADMIN]}>
                        <SalonDashboardPage />
                      </ProtectedRoute>
                    } />
                    <Route path="/inbox" element={
                      <ProtectedRoute>
                        <InboxPage />
                      </ProtectedRoute>
                    } />
                    <Route path="/chat/:threadId" element={
                      <ProtectedRoute>
                        <ChatPage />
                      </ProtectedRoute>
                    } />
                    <Route path="/admin" element={
                      <ProtectedRoute allowedRoles={[UserRole.ADMIN]}>
                        <AdminPage />
                      </ProtectedRoute>
                    } />
                    <Route path="/progress-dashboard" element={
                      <ProtectedRoute allowedRoles={[UserRole.ADMIN]}>
                        <ProgressDashboardPage />
                      </ProtectedRoute>
                    } />
                  </Routes>
                </Suspense>
              </main>
              
              <Footer />
              <AIAssistant />
            </div>
          </Router>
        </NotificationProvider>
      </CartProvider>
    </AuthProvider>
  );
};

export default App;
