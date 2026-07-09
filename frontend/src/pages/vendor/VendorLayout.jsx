import Sidebar from '../../Components/vendor/VendorSidebar';
import { useAuth } from '../../Context/AuthContext';
import { Outlet } from 'react-router-dom';

const VendorLayout = () => {
  const { user, logout, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100">
        <div className="bg-white/70 backdrop-blur-md p-8 rounded-xl shadow-lg">
          <div className="w-10 h-10 border-4 border-purple-400 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-purple-600 mt-4 text-center">Loading user info...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <p className="text-purple-600">User not found. Please log in.</p>;
  }

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100">
      <Sidebar />

      <main className="flex-1 p-6">
        <div className="bg-white/70 backdrop-blur-md rounded-2xl shadow-xl p-8 min-h-[90vh]">

          {/* Top Bar */}
          <div className="flex justify-between items-center border-b border-purple-200 pb-4 mb-6">
            <div>
              <h1 className="text-2xl font-bold text-purple-700">
                Vendor Panel 🍭
              </h1>
              <p className="text-pink-600">{user?.name || 'Vendor'}</p>
            </div>

            <button
              onClick={logout}
              className="px-5 py-2 rounded-full bg-gradient-to-r from-pink-400 to-purple-500 text-white font-semibold"
            >
              Logout
            </button>
          </div>

          {/* Nested pages will render here */}
          <Outlet />

        </div>
      </main>
    </div>
  );
};

export default VendorLayout;
