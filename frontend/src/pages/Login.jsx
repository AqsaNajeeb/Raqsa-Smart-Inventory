import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext';
import { AlertCircle, Mail, Lock } from 'lucide-react';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  /* ================= VALIDATION ================= */
  const validateForm = () => {
    const newErrors = {};
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.password) newErrors.password = 'Password is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setErrors({});

    try {
      const result = await login(formData.email, formData.password);

      if (result?.success) {
        const userRole = result.user?.role;

        if (userRole === 'vendor') {
          navigate('/vendors'); // vendor
        } else {
          navigate('/profile'); // customer
        }
      } else {
        setErrors({
          general: result?.message || 'Invalid email or password'
        });
      }
    } catch (error) {
      setErrors({
        general: error?.message || 'Server error. Please try again.'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  /* ================= UI ================= */
  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100">

      {/* Left Image */}
      <section className="hidden md:flex flex-1 items-center justify-center">
        <img
          src="/images/Raqsa.png"
          alt="Raqsa"
          className="w-3/4 h-auto object-contain"
        />
      </section>

      {/* Right Form */}
      <section className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md bg-white/70 backdrop-blur-md rounded-xl shadow-2xl p-8">

          <h2 className="text-2xl font-bold text-purple-700 text-center">
            Welcome Back 👋
          </h2>
          <p className="text-purple-500 text-center mb-6">
            Login to continue shopping
          </p>

          {errors.general && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2 text-red-600">
              <AlertCircle className="w-5 h-5" />
              <span>{errors.general}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Email */}
            <div>
              <label className="text-sm font-medium mb-1 block text-gray-700">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className={`w-full px-10 py-2 border rounded-lg ${
                    errors.email ? 'border-red-500' : 'border-gray-300'
                  } focus:ring-2 focus:ring-pink-300 focus:outline-none`}
                />
              </div>
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="text-sm font-medium mb-1 block text-gray-700">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className={`w-full px-10 py-2 border rounded-lg ${
                    errors.password ? 'border-red-500' : 'border-gray-300'
                  } focus:ring-2 focus:ring-pink-300 focus:outline-none`}
                />
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password}</p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-purple-400 to-pink-400 text-white rounded-lg shadow-md hover:from-pink-400 hover:to-purple-400 transition-all"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>

            <p className="text-center text-purple-600 mt-4">
              Don&apos;t have an account?{' '}
              <Link to="/signup" className="font-semibold hover:text-pink-500">
                Sign up
              </Link>
            </p>

          </form>
        </div>
      </section>
    </div>
  );
};

export default Login;
