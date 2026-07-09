import React, { useState } from 'react';
import { useRef } from 'react';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle } from 'lucide-react';
import axios from 'axios';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    phone: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const successRef = useRef(null);


  const contactInfo = [
    { icon: <MapPin className="w-6 h-6 text-purple-600" />, title: 'Address', detail: 'UET Taxila, Main GT Road, Taxila, Pakistan' },
    { icon: <Phone className="w-6 h-6 text-purple-600" />, title: 'Phone', detail: '+92 300 1234567' },
    { icon: <Mail className="w-6 h-6 text-purple-600" />, title: 'Email', detail: 'support@iqrashop.com' },
    { icon: <Clock className="w-6 h-6 text-purple-600" />, title: 'Business Hours', detail: 'Mon - Sat: 9:00 AM - 6:00 PM' }
  ];

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    if (!formData.subject.trim()) newErrors.subject = 'Subject is required';
    if (!formData.message.trim()) newErrors.message = 'Message is required';
    else if (formData.message.length < 10) newErrors.message = 'Message must be at least 10 characters';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setErrors({});
    try {
      const response = await axios.post( `${import.meta.env.VITE_API_URL}/api/contact`, formData );

      if (response.data?.success || response.status === 200 || response.status === 201) {
        setSuccess(true);
        setTimeout(() => {
  successRef.current?.scrollIntoView({ behavior: 'smooth' });
}, 100);
        setFormData({ name: '', email: '', subject: '', message: '', phone: '' });
        setTimeout(() => setSuccess(false), 5000);
      }
    } catch (error) {
      if (error.response?.data?.errors) {
  const fieldErrors = {};
  error.response.data.errors.forEach(err => {
    fieldErrors[err.path] = err.msg;
  });
  setErrors(fieldErrors);
} else {
  setErrors({
    general: error.response?.data?.message || 'Failed to send message. Please try again.'
  });
}

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen py-12 overflow-hidden">

      {/* Gradient Blobs */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div
          className="absolute -top-48 -left-48 w-[60rem] h-[60rem]
          bg-gradient-to-br from-purple-600 via-pink-500 to-pink-300
          opacity-30 rounded-full blur-[140px] animate-blob"
        />
        <div
          className="absolute -bottom-56 -right-56 w-[65rem] h-[65rem]
          bg-gradient-to-tr from-purple-500 via-pink-500 to-pink-400
          opacity-25 rounded-full blur-[160px] animate-blob animation-delay-2s"
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">

        {/* Success Message */}
        {success && (
  <div ref={successRef}
    className="mb-8 p-4 rounded-lg flex items-center gap-3
    bg-green-50 border border-green-300 shadow-md animate-fadeIn"
  >
    <CheckCircle className="w-5 h-5 text-green-600" />
    <div>
      <p className="text-green-700 font-semibold">
        Message sent successfully!
      </p>
      <p className="text-green-600 text-sm">
        Thank you for contacting Raqsa. We’ll reply shortly.
      </p>
    </div>
  </div>
)}


        {/* Header */}
        <div className="text-center mb-14">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-purple-900">
            Contact <span className="text-pink-600">Raqsa</span>
          </h1>
          <p className="text-lg text-purple-700 max-w-2xl mx-auto">
            We'd love to hear from you. Fill out the form and our team will get back to you soon.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">

          {/* Contact Form */}
          <div className="p-8 rounded-xl bg-white/70 backdrop-blur-md shadow-lg">
            <h2 className="text-2xl font-bold mb-6 text-purple-800">Send us a message</h2>

            {errors.general && (
              <div className="mb-6 p-4 rounded-lg text-red-500 bg-red-50 border border-red-300">
                {errors.general}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Full Name *"
                  className={`w-full border px-4 py-2 rounded-lg focus:ring-2 focus:ring-purple-300 outline-none ${errors.name ? 'border-red-400' : 'border-purple-200'}`}
                />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Email Address *"
                  className={`w-full border px-4 py-2 rounded-lg focus:ring-2 focus:ring-purple-300 outline-none ${errors.email ? 'border-red-400' : 'border-purple-200'}`}
                />
              </div>

              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Phone Number (Optional)"
                className="w-full border border-purple-200 px-4 py-2 rounded-lg focus:ring-2 focus:ring-purple-300 outline-none"
              />

              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                placeholder="Subject *"
                className={`w-full border px-4 py-2 rounded-lg focus:ring-2 focus:ring-purple-300 outline-none ${errors.subject ? 'border-red-400' : 'border-purple-200'}`}
              />

              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows="5"
                placeholder="Message *"
                className={`w-full border px-4 py-2 rounded-lg focus:ring-2 focus:ring-purple-300 outline-none ${errors.message ? 'border-red-400' : 'border-purple-200'}`}
              />

              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3 rounded-full
                bg-gradient-to-r from-purple-500 to-pink-500
                text-white font-medium shadow-md
                transition flex justify-center items-center
                ${loading ? 'opacity-60 cursor-not-allowed' : 'hover:from-pink-500 hover:to-purple-500'}`}
              >
                {loading ? 'Sending...' : (
                  <>
                    <Send className="w-5 h-5 mr-2" /> Send Message
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Info + Map */}
          <div className="space-y-8">
            <div className="p-8 rounded-xl bg-white/70 backdrop-blur-md shadow-lg">
              <h2 className="text-2xl font-bold mb-6 text-purple-800">Contact Information</h2>
              {contactInfo.map((info, index) => (
                <div key={index} className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center">
                    {info.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold">{info.title}</h3>
                    <p className="text-gray-600">{info.detail}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="rounded-xl overflow-hidden shadow-lg bg-white/70">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3320.352611385724!2d72.82276127470392!3d33.74614373596464!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x38df0e1e1864d97b%3A0x9bfbf2d4108045c5!2sUniversity%20of%20Engineering%20and%20Technology%20Taxila!5e0!3m2!1sen!2s!4v1728972800000!5m2!1sen!2s"
                className="w-full h-64 border-0"
                loading="lazy"
                title="UET Taxila Location"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Animations */}
      <style>
        {`
          @keyframes blob {
            0%,100% { transform: translate(0,0) scale(1); }
            33% { transform: translate(30px,-50px) scale(1.1); }
            66% { transform: translate(-20px,20px) scale(0.9); }
          }
          .animate-blob { animation: blob 12s infinite; }
          .animation-delay-2s { animation-delay: 2s; }
          @keyframes fadeIn {
  from { opacity: 0; transform: translateY(-6px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fadeIn {
  animation: fadeIn 0.4s ease-out;
}

        `}
      </style>

    </div>
  );
};

export default Contact;
