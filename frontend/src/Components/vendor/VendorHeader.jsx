import { useContext } from 'react';
import { AuthContext } from '../../Context/AuthContext';

const VendorHeader = () => {
  const { logout } = useContext(AuthContext);

  return (
    <header className="bg-white/80 backdrop-blur-md shadow-lg px-6 py-4 flex justify-between items-center">
      <h1 className="text-2xl font-bold text-purple-700">�� Vendor Panel</h1>
      <button
        onClick={logout}
        className="px-4 py-2 bg-pink-500 text-white rounded-xl hover:bg-pink-600 transition"
      >
        Logout
      </button>
    </header>
  );
};

export default VendorHeader;
