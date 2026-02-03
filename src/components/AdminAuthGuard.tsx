import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdminLoginModal from "../shared/components/ui/AdminLoginModal";
import AdminRegisterModal from "../shared/components/ui/AdminRegisterModal";

interface AdminAuthGuardProps {
  children: React.ReactNode;
}

export default function AdminAuthGuard({ children }: AdminAuthGuardProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = () => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    
    if (token && user) {
      try {
        const userData = JSON.parse(user);
        if (userData.role === 'admin' || userData.UserType === 'admin') {
          setIsAuthenticated(true);
        } else {
          setShowLoginModal(true);
        }
      } catch (error) {
        setShowLoginModal(true);
      }
    } else {
      setShowLoginModal(true);
    }
    setLoading(false);
  };

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    setShowLoginModal(false);
  };

  const handleRegisterSuccess = () => {
    setIsAuthenticated(true);
    setShowRegisterModal(false);
  };

  // Remove this unused function
  // const handleLogout = () => {
  //   localStorage.removeItem('token');
  //   localStorage.removeItem('user');
  //   setIsAuthenticated(false);
  //   setShowLoginModal(true);
  // };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Admin Access Required</h1>
          <p className="text-gray-600 mb-6">Please sign in with your admin credentials to continue.</p>
          <button
            onClick={() => setShowLoginModal(true)}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Admin Sign In
          </button>
        </div>

        <AdminLoginModal
          isOpen={showLoginModal}
          onClose={() => navigate('/')}
          onLoginSuccess={handleLoginSuccess}
          onSwitchToRegister={() => {
            setShowLoginModal(false);
            setShowRegisterModal(true);
          }}
        />

        <AdminRegisterModal
          isOpen={showRegisterModal}
          onClose={() => navigate('/')}
          onRegisterSuccess={handleRegisterSuccess}
          onSwitchToLogin={() => {
            setShowRegisterModal(false);
            setShowLoginModal(true);
          }}
        />
      </div>
    );
  }

  return <>{children}</>;
}