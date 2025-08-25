import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import ProtectedRoute from './components/common/ProtectedRoute';
import FeaturedHomePage from './pages/FeaturedHomePage';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import PrivacyPage from './pages/PrivacyPage';
import TermsPage from './pages/TermsPage';
import LoginForm from './components/auth/LoginForm';
import RegisterForm from './components/auth/RegisterForm';
import VideoPlayer from './components/video/VideoPlayer';
import AdminLayout from './components/admin/AdminLayout';
import AdminDashboard from './components/admin/AdminDashboard';
import VideoManagement from './components/admin/VideoManagement';
import VideoUpload from './components/admin/VideoUpload';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<LoginForm />} />
          <Route path="/register" element={<RegisterForm />} />
          
          {/* Routes with Header */}
          <Route
            path="/*"
            element={
              <>
                <Header />
                <Routes>
                  <Route path="/" element={<FeaturedHomePage />} />
                  <Route path="/browse" element={<HomePage />} />
                  <Route path="/about" element={<AboutPage />} />
                  <Route path="/contact" element={<ContactPage />} />
                  <Route path="/privacy" element={<PrivacyPage />} />
                  <Route path="/terms" element={<TermsPage />} />
                  <Route path="/video/:id" element={<VideoPlayer />} />
                  
                  {/* Admin Routes */}
                  <Route
                    path="/admin/*"
                    element={
                      <ProtectedRoute requireRole="creator">
                        <AdminLayout>
                          <Routes>
                            <Route path="/" element={<AdminDashboard />} />
                            <Route path="/videos" element={<VideoManagement />} />
                            <Route path="/upload" element={<VideoUpload />} />
                            <Route path="/analytics" element={<div className="text-white">Analytics Coming Soon</div>} />
                            <Route path="/settings" element={<div className="text-white">Settings Coming Soon</div>} />
                          </Routes>
                        </AdminLayout>
                      </ProtectedRoute>
                    }
                  />
                </Routes>
                <Footer />
              </>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;