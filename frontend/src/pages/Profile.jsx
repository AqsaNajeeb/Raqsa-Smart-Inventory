import React, { useState, useEffect } from 'react';
import api from '../api/axios';

import ProfileSidebar from '../Components/profile/ProfileSidebar';
import PersonalInfo from '../Components/profile/PersonalInfo';
import OrdersTab from '../Components/profile/OrdersTab';
import WishlistTab from '../Components/profile/WishlistTab';
import AddressTab from '../Components/profile/AddressTab';
import PaymentTab from '../Components/profile/PaymentTab';
import SettingsTab from '../Components/profile/SettingsTab';

import { useAuth } from '../Context/AuthContext';
import {
  User,
  MapPin,
  CreditCard,
  Heart,
  Package,
  Settings
} from 'lucide-react';

const Profile = () => {
  const { user, logout, updateProfile } = useAuth();

  const [activeTab, setActiveTab] = useState('personal');
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);

  const [profileData, setProfileData] = useState({
    firstname: '',
    lastname: '',
    email: '',
    phone: '',
    phoneVerified: false,
    language: '',
    currency: '',
    smsAlerts: false,
    whatsappUpdates: false,
    emailNotifications: true,
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'Pakistan'
    }
  });

  const [orders, setOrders] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [paymentMethods] = useState([]);

  const [settings, setSettings] = useState({
    emailNotifications: true,
    orderUpdates: true,
    marketingEmails: false
  });

  // ✅ Load user data
  useEffect(() => {
  if (!user) return;

  const cachedProfile = localStorage.getItem('tempProfile');

  const source = cachedProfile ? JSON.parse(cachedProfile) : user;

  setProfileData({
    firstname: source.firstname || '',
    lastname: source.lastname || '',
    email: source.email || '',
    phone: source.phone || '',
    phoneVerified: source.phoneVerified || false,
    language: source.language || '',
    currency: source.currency || '',
    smsAlerts: source.smsAlerts || false,
    whatsappUpdates: source.whatsappUpdates || false,
    emailNotifications: source.emailNotifications || true,
    address: source.address || {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'Pakistan'
    }
  });

  fetchUserData();
}, [user]);

  // ✅ Fetch orders & wishlist
  const fetchUserData = async () => {
  try {
    const ordersRes = await api.get('/profile/orders');
    setOrders(ordersRes.data.orders || []);

    // API wishlist
    const wishlistRes = await api.get('/profile/wishlist');
    const apiWishlist = wishlistRes.data.wishlist || [];

    // Local wishlist (from ProductModal)
    const localWishlist =
      JSON.parse(localStorage.getItem('wishlist')) || [];

    // Merge both (avoid duplicates by _id)
    const merged = [
      ...apiWishlist,
      ...localWishlist.filter(
        (localItem) =>
          !apiWishlist.some(apiItem => apiItem._id === localItem._id)
      )
    ];

    setWishlist(merged);
  } catch (err) {
    console.error(err);

    // Fallback: still show local wishlist if API fails
    const localWishlist =
      JSON.parse(localStorage.getItem('wishlist')) || [];
    setWishlist(localWishlist);
  } finally {
    setLoading(false);
  }
};


  // ✅ Correct input handler (supports address)
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name.startsWith('address.')) {
      const field = name.split('.')[1];
      setProfileData(prev => ({
        ...prev,
        address: {
          ...prev.address,
          [field]: value
        }
      }));
    } else {
      setProfileData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSaveProfile = async () => {
  // Save temporarily in browser
  localStorage.setItem('tempProfile', JSON.stringify(profileData));

  setEditMode(false);
};

  const handleLogout = () => {
    logout();
    window.location.href = '/';
  };

  const tabs = [
    { id: 'personal', label: 'Personal Info', icon: <User size={18} /> },
    { id: 'orders', label: 'Orders', icon: <Package size={18} /> },
    { id: 'wishlist', label: 'Wishlist', icon: <Heart size={18} /> },
    { id: 'payment', label: 'Payments', icon: <CreditCard size={18} /> },
    { id: 'address', label: 'Addresses', icon: <MapPin size={18} /> },
    { id: 'settings', label: 'Settings', icon: <Settings size={18} /> }
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-12 w-12 border-t-4 border-purple-500 rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100">

      <div className="container mx-auto px-4 py-10 grid lg:grid-cols-4 gap-8">

        <ProfileSidebar
          user={user}
          tabs={tabs}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          editMode={editMode}
          setEditMode={(val) => {
            if (val) setActiveTab('personal'); // force personal tab on edit
            setEditMode(val);
          }}
          logout={handleLogout}
        />

        <section className="lg:col-span-3 space-y-6">

          {editMode && (
            <div className="bg-yellow-100 text-yellow-800 px-4 py-3 rounded-lg">
              You are editing your profile. Don’t forget to save changes.
            </div>
          )}

          {activeTab === 'personal' && (
            <PersonalInfo
              profileData={profileData}
              editMode={editMode}
              handleInputChange={handleInputChange}
              handleSaveProfile={handleSaveProfile}
            />
          )}

          {activeTab === 'orders' && <OrdersTab orders={orders} />}

          {activeTab === 'wishlist' && (
  <WishlistTab wishlist={wishlist} setWishlist={setWishlist} />
)}


          {activeTab === 'payment' && (
            <PaymentTab paymentMethods={paymentMethods} />
          )}

          {activeTab === 'address' && (
            <AddressTab
              profileData={profileData}
              editMode={editMode}
              handleInputChange={handleInputChange}
              handleSaveProfile={handleSaveProfile}
            />
          )}

          {activeTab === 'settings' && (
            <SettingsTab settings={settings} setSettings={setSettings} />
          )}

        </section>
      </div>
    </div>
  );
};

export default Profile;
