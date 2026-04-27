import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AnimatePresence } from 'framer-motion';
import { AuthProvider, useAuth } from './context/AuthContext';
import Particles from './components/Particles';
import Navbar from './components/Navbar';
import PageWrapper from './components/PageWrapper';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import VerifyOTP from './pages/VerifyOTP';
import Dashboard from './pages/Dashboard';
import FamilyForm from './pages/FamilyForm';
import AdminPanel from './pages/AdminPanel';
import Newsfeed from './pages/Newsfeed';

const PrivateRoute = ({ children }) => {
  const { token } = useAuth();
  return token ? children : <Navigate to="/login" />;
};

const AdminRoute = ({ children }) => {
  const { token, user } = useAuth();
  // Protect route: requires token AND admin role
  return token && user?.role === 'admin' ? children : <Navigate to="/" />;
};

function AppRoutes() {
  const location = useLocation();

  return (
    <>
      <div className="bg-krishna" />
      <div className="bg-overlay" />
      <Particles />
      <Navbar />
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<PageWrapper><Home /></PageWrapper>} />
          <Route path="/login" element={<PageWrapper><Login /></PageWrapper>} />
          <Route path="/register" element={<PageWrapper><Register /></PageWrapper>} />
          <Route path="/verify-otp" element={<PageWrapper><VerifyOTP /></PageWrapper>} />
          <Route path="/dashboard" element={<PrivateRoute><PageWrapper><Dashboard /></PageWrapper></PrivateRoute>} />
          <Route path="/posts" element={<PrivateRoute><PageWrapper><Newsfeed /></PageWrapper></PrivateRoute>} />
          <Route path="/family" element={<PrivateRoute><PageWrapper><FamilyForm /></PageWrapper></PrivateRoute>} />
          <Route path="/admin" element={<AdminRoute><PageWrapper><AdminPanel /></PageWrapper></AdminRoute>} />
        </Routes>
      </AnimatePresence>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: 'rgba(30,15,0,0.95)',
            color: '#f5d020',
            border: '1px solid rgba(245,166,35,0.4)',
            backdropFilter: 'blur(10px)'
          }
        }}
      />
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

