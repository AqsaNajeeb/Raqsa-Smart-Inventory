import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import Navbar from './Components/Navbar';
import Footer from './Components/Footer';

import Home from './pages/Home';
import Shop from './pages/Shop';
import Contact from './pages/Contact';
import About from './pages/About'; 
import Login from './pages/Login';
import Signup from './pages/Signup';
import Profile from './pages/Profile';
import Cart from './pages/Cart';
import CategoriesPage from './pages/CategoriesPage.jsx';
import Checkout from './pages/Checkout.jsx'; 

import ProtectedRoute from './Components/ProtectedRoute';
import PublicRoute from './Components/PublicRoute';

/* ================= VENDOR PAGES ================= */
import VendorLayout from './pages/vendor/VendorLayout';
import VendorDashboard from './pages/vendor/Dashboard';
import VendorProducts from './pages/vendor/Products';
import VendorAddProduct from './pages/vendor/AddProduct';
import VendorLowStock from './pages/vendor/LowStock';
import VendorOrders from './pages/vendor/Orders';
import VendorAnalytics from './pages/vendor/Analytics';
import Messages from './pages/vendor/Messages';


import './index.css';

function App() {
  return (
    <div className="min-h-screen flex flex-col">

      {/* Navbar visible for public + customer only */}
      <Navbar />

      <main className="flex-grow pt-16">
        <Routes>

          {/* ================= PUBLIC ================= */}
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/categories" element={<CategoriesPage />} />

          {/* ================= AUTH ================= */}
          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />
          <Route
            path="/signup"
            element={
              <PublicRoute>
                <Signup />
              </PublicRoute>
            }
          />

          {/* ================= CUSTOMER ================= */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute role="customer">
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/checkout"
            element={
              <ProtectedRoute role="customer">
                <Checkout />
              </ProtectedRoute>
            }
          /> 

          {/* ================= VENDOR ================= */}
          <Route
            path="/vendor"
            element={
              <ProtectedRoute role="vendor">
                <VendorLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<VendorDashboard />} />
            <Route path="products" element={<VendorProducts />} />
            <Route path="add-product" element={<VendorAddProduct />} />
            <Route path="low-stock" element={<VendorLowStock />} />
            <Route path="orders" element={<VendorOrders />} />
            <Route path="analytics" element={<VendorAnalytics />} />
            <Route path="messages" element={<Messages />} /> {/* NEW */}
          </Route>

          {/* ================= FALLBACK ================= */}
          <Route path="*" element={<Navigate to="/" />} />

        </Routes>
      </main>

      <Footer />
    </div>
  );
}

export default App;
