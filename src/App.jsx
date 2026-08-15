import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';
import ScrollToTop from './components/ScrollToTop';
import Home from '@/pages/Home';
import Discover from '@/pages/Discover';
import CreativeDetail from '@/pages/CreativeDetail';
import Saved from '@/pages/Saved';
import BookingForm from '@/pages/BookingForm';
import Projects from '@/pages/Projects';
import LegacyProjectsRedirect from '@/components/projects/LegacyProjectsRedirect';
import Community from '@/pages/Community';
import Profile from '@/pages/Profile';
import PortfolioManager from '@/pages/PortfolioManager';
import Account from '@/pages/Account';
import EventDetail from '@/pages/EventDetail';
import PublicPortfolio from '@/pages/PublicPortfolio';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import ForgotPassword from '@/pages/ForgotPassword';
import ResetPassword from '@/pages/ResetPassword';
// Add page imports here

const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings, authError, navigateToLogin } = useAuth();

  // Show loading spinner while checking app public settings or auth
  if (isLoadingPublicSettings || isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
      </div>
    );
  }

  // Handle authentication errors
  if (authError) {
    if (authError.type === 'user_not_registered') {
      return <UserNotRegisteredError />;
    } else if (authError.type === 'auth_required') {
      // Redirect to login automatically
      navigateToLogin();
      return null;
    }
  }

  // Render the main app
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/" element={<Home />} />
      <Route path="/marketplace" element={<Discover />} />
      <Route path="/discover" element={<Discover />} />
      <Route path="/discover/:field" element={<Discover />} />
      <Route path="/creative/:id" element={<CreativeDetail />} />
      <Route path="/saved" element={<Saved />} />
      <Route path="/book/:id" element={<BookingForm />} />
      <Route path="/projects" element={<Projects />} />
      <Route path="/bookings" element={<LegacyProjectsRedirect />} />
      <Route path="/messages" element={<LegacyProjectsRedirect />} />
      <Route path="/community" element={<Community />} />
      <Route path="/community/events/:id" element={<EventDetail />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/portfolio" element={<PortfolioManager />} />
      <Route path="/portfolio/:id" element={<PublicPortfolio />} />
      <Route path="/account" element={<Account />} />
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};


function App() {

  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router>
          <ScrollToTop />
          <AuthenticatedApp />
        </Router>
        <Toaster />
      </QueryClientProvider>
    </AuthProvider>
  )
}

export default App