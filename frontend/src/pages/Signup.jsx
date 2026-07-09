import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AlertCircle, Check } from 'lucide-react';
import { useAuth } from '../Context/AuthContext';

const Signup = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'customer',
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [redirectPath, setRedirectPath] = useState('/profile');

  /* ================= VALIDATION ================= */
  const validateForm = () => {
    const newErrors = {};
    if (!formData.firstname.trim()) newErrors.firstname = 'First name is required';
    if (!formData.lastname.trim()) newErrors.lastname = 'Last name is required';
    if (!formData.username.trim()) newErrors.username = 'Username is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.password.trim()) newErrors.password = 'Password is required';
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /* ================= HANDLE SUBMIT ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setErrors({});

    try {
      const payload = {
        name: `${formData.firstname} ${formData.lastname}`,
        username: formData.username,
        email: formData.email,
        password: formData.password,
        role: formData.role,
      };

      const result = await register(payload);

      if (result.success) {
        // Redirect based on role
        setRedirectPath(formData.role === 'vendor' ? '/vendor/dashboard' : '/profile');
        setSuccess(true);

        setTimeout(() => navigate(redirectPath), 2000);
      } else {
        setErrors({ general: result.message || 'Signup failed. Please try again.' });
      }
    } catch (err) {
      setErrors({ general: err.message || 'Server error. Please try later.' });
    } finally {
      setLoading(false);
    }
  };

  /* ================= HANDLE CHANGE ================= */
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  /* ================= SUCCESS SCREEN ================= */
  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100">
        <div className="bg-white/70 backdrop-blur-md p-10 rounded-xl shadow-xl text-center">
          <Check className="w-12 h-12 mx-auto text-green-600 mb-4" />
          <h2 className="text-2xl font-bold text-purple-700">Account Created!</h2>
          <p className="text-purple-500 mt-2">Redirecting to your dashboard...</p>
        </div>
      </div>
    );
  }

  /* ================= MAIN UI ================= */
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
            Create Your Account
          </h2>
          <p className="text-purple-500 text-center mb-6">
            Sign up to start your journey
          </p>

          {errors.general && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2 text-red-600">
              <AlertCircle className="w-5 h-5" />
              <span>{errors.general}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <input
                name="firstname"
                placeholder="First Name"
                value={formData.firstname}
                onChange={handleChange}
                className="input"
              />
              <input
                name="lastname"
                placeholder="Last Name"
                value={formData.lastname}
                onChange={handleChange}
                className="input"
              />
            </div>

            <input
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
              className="input"
            />

            <input
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="input"
            />

            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="input"
            />

            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="input"
            />

            {/* Role Selection */}
            <div className="flex items-center space-x-4 mt-2">
              {['customer', 'vendor'].map((r) => (
                <label key={r} className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="role"
                    value={r}
                    checked={formData.role === r}
                    onChange={handleChange}
                    className="accent-pink-400"
                  />
                  <span className="text-purple-700">{r.charAt(0).toUpperCase() + r.slice(1)}</span>
                </label>
              ))}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-purple-400 to-pink-400 text-white rounded-lg shadow-md hover:from-pink-400 hover:to-purple-400 transition-all"
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>

            <p className="text-center text-purple-600">
              Already have an account?{' '}
              <Link to="/login" className="font-semibold hover:text-pink-500">
                Sign in
              </Link>
            </p>
          </form>
        </div>
      </section>
    </div>
  );
};

export default Signup;
