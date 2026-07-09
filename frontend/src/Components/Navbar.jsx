import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../assets/Raqsa.png';
import { useAuth } from '../Context/AuthContext.jsx';
import { useCart } from '../Context/CartContext.jsx';
import { useSearch } from '../Context/SearchContext.jsx';
import {
  TrendingUp,
  ShoppingCart,
  User,
  Search,
  Menu,
  X,
  Home,
  ShoppingBag,
  Phone,
  Info
} from 'lucide-react';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout, isAuthenticated } = useAuth();
  const { cartItems } = useCart();
  const { searchTerm, setSearchTerm } = useSearch();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
    setIsMenuOpen(false);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    if (window.location.pathname !== '/shop') {
      navigate('/shop');
    }
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-white/70 backdrop-blur-md shadow-lg">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">

          {/* Logo (slightly right) */}
          <Link to="/" className="flex items-center ml-4">
            <img
             src={logo}
              alt="Raqsa Logo"
              className="h-16 w-auto object-contain"
            />
          </Link> 

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="nav-link flex items-center">
              <Home className="w-4 h-4 mr-2" /> Home
            </Link>
            <Link to="/shop" className="nav-link flex items-center">
              <ShoppingBag className="w-4 h-4 mr-2" /> Shop
            </Link>
            <Link to="/about" className="nav-link flex items-center">
              <TrendingUp className="w-4 h-4 mr-2" /> About
            </Link>
            <Link to="/contact" className="nav-link flex items-center">
              <Phone className="w-4 h-4 mr-2" /> Contact
            </Link>
          </div>

          {/* Search (smaller) */}
          <div className="hidden md:block flex-1 max-w-sm mx-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={handleSearch}
                className="w-full pl-9 pr-3 py-1.5 border border-gray-300 rounded-lg text-sm"
              />
            </div>
          </div>

          {/* Right (slightly left) */}
          <div className="flex items-center space-x-4 mr-2">

            {/* Cart */}
            <Link to="/cart" className="relative">
              <ShoppingCart className="w-6 h-6 text-gray-700 hover:text-purple-600" />
              {cartItems.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-pink-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cartItems.length}
                </span>
              )}
            </Link>

            {/* User */}
            {isAuthenticated ? (
              <div className="relative group">
                <button className="flex items-center space-x-2">
                  <User className="w-6 h-6 text-gray-700" />
                  <span className="hidden md:inline">{user?.firstname}</span>
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 hidden group-hover:block">
                  <Link to="/profile" className="block px-4 py-2 hover:bg-gray-100">Profile</Link>
                  <Link to="/orders" className="block px-4 py-2 hover:bg-gray-100">My Orders</Link>
                  <Link to="/wishlist" className="block px-4 py-2 hover:bg-gray-100">Wishlist</Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <Link to="/login" className="flex items-center space-x-2">
                <User className="w-6 h-6 text-gray-700" />
                <span className="hidden md:inline">Login</span>
              </Link>
            )}

            {/* Mobile Menu */}
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden">
              {isMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <div className="flex flex-col space-y-4">
              <Link to="/" onClick={() => setIsMenuOpen(false)} className="mobile-nav-link flex items-center">
                <Home className="w-5 h-5 mr-3" /> Home
              </Link>
              <Link to="/shop" onClick={() => setIsMenuOpen(false)} className="mobile-nav-link flex items-center">
                <ShoppingBag className="w-5 h-5 mr-3" /> Shop
              </Link>
              <Link to="/about" onClick={() => setIsMenuOpen(false)} className="mobile-nav-link flex items-center">
                <Info className="w-5 h-5 mr-3" /> About
              </Link>
              <Link to="/contact" onClick={() => setIsMenuOpen(false)} className="mobile-nav-link flex items-center">
                <Phone className="w-5 h-5 mr-3" /> Contact
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
