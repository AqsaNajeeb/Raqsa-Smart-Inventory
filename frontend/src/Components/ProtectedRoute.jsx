import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext';

const ProtectedRoute = ({ children, role }) => {
  const { isAuthenticated, role: userRole, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100">
        <div className="bg-white/70 backdrop-blur-md p-8 rounded-xl shadow-lg">
          <div className="w-10 h-10 border-4 border-purple-400 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-purple-600 mt-4 text-center">
            Checking access...
          </p>
        </div>
      </div>
    );
  }

  // Not logged in → redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Role mismatch → redirect to profile
  if (role && userRole !== role) {
    return <Navigate to="/profile" replace />;
  }

  // ✅ For nested routes, render Outlet if no children
  return children ? children : <Outlet />;
};

export default ProtectedRoute;
