import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';
import api from '../api/axios';

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  /* ================= BOOTSTRAP AUTH (ON REFRESH) ================= */
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');

    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
      setToken(storedToken);
      api.defaults.headers.common.Authorization = `Bearer ${storedToken}`;
    }

    setLoading(false);
  }, []);

  /* ================= AUTH HEADER SYNC ================= */
  useEffect(() => {
    if (token) {
      api.defaults.headers.common.Authorization = `Bearer ${token}`;
    } else {
      delete api.defaults.headers.common.Authorization;
    }
  }, [token]);

  /* ================= SAFE AUTO LOGOUT ON 401 ================= */
  useEffect(() => {
    const interceptor = api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401 && token) {
          logout();
        }
        return Promise.reject(error);
      }
    );

    return () => api.interceptors.response.eject(interceptor);
  }, [token]);

  /* ================= LOGIN ================= */
  const login = async (email, password) => {
    try {
      setLoading(true);

      const res = await api.post('/auth/login', { email, password });
      const { token, user } = res.data;

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      setToken(token);
      setUser(user);

      return { success: true, user };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || 'Login failed',
      };
    } finally {
      setLoading(false);
    }
  };

  /* ================= REGISTER ================= */
  const register = async (payload) => {
    try {
      setLoading(true);

      const res = await api.post('/auth/register', payload);
      const { token, user } = res.data;

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      setToken(token);
      setUser(user);

      return { success: true, user };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || 'Registration failed',
      };
    } finally {
      setLoading(false);
    }
  };

  /* ================= LOGOUT ================= */
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
    delete api.defaults.headers.common.Authorization;
  };

  /* ================= UPDATE PROFILE ================= */
  const updateProfile = async (updatedData) => {
  try {
    // Update in DB
    await api.put('/profile', updatedData);

    // Fetch fresh profile
    const fresh = await api.get('/profile');

    if (fresh?.data?.user) {
      setUser(fresh.data.user);
      localStorage.setItem('user', JSON.stringify(fresh.data.user));
    }

    alert('Profile updated successfully!');
  } catch (error) {
    console.error(error);
    alert('Profile was saved, but failed to refresh profile data.');
  }
};

  /* ================= ROLE HELPERS ================= */
  const role = user?.role || 'customer';

  const value = {
    user,
    setUser,
    token,
    setToken,
    role,
    loading,
    isAuthenticated: Boolean(user && token),
    isCustomer: role === 'customer',
    isVendor: role === 'vendor',
    login,
    register,
    logout,
    updateProfile,
  };

  /* ================= LOADING SCREEN ================= */
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-xl text-purple-600">
        Loading...
      </div>
    );
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
