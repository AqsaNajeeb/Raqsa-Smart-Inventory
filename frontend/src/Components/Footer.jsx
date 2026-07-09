import React from 'react';
import { CreditCard, DollarSign, Wallet, Mail, Phone } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="mt-16 bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100 text-gray-700">
      
      <div className="container mx-auto px-6 py-14 grid gap-10 md:grid-cols-5">

        {/* Company Info */}
        <div>
          <h3 className="font-semibold text-purple-800 mb-4">Company Info</h3>
          <ul className="space-y-2 text-sm">
            <li><a href="/about" className="hover:text-purple-600">About RAQSA</a></li>
           
          </ul>
        </div>

        {/* Help & Support */}
        <div>
          <h3 className="font-semibold text-purple-800 mb-4">Help & Support</h3>
          <ul className="space-y-2 text-sm">
            <li><a href="/shipping" className="hover:text-purple-600">Shipping Info</a></li>
            
            <li><a href="/size-guide" className="hover:text-purple-600">Size Guide</a></li>
          </ul>
        </div>

        {/* Customer Care */}
        <div>
          <h3 className="font-semibold text-purple-800 mb-4">Customer Care</h3>
          <ul className="space-y-2 text-sm">
            <li><a href="/contact" className="hover:text-purple-600">Contact Us</a></li>
            <li><a href="/payment" className="hover:text-purple-600">Payment Methods</a></li>
            <li><a href="/faq" className="hover:text-purple-600">FAQ</a></li>
          </ul>
        </div>

        {/* Newsletter */}
        <div className="md:col-span-2 bg-white/70 backdrop-blur-md rounded-xl p-6 shadow-lg">
          <h3 className="font-semibold text-purple-800 mb-4">
            Get RAQSA Style Updates
          </h3>

          <div className="space-y-3">
            <div className="relative">
              <Mail className="absolute left-3 top-3 text-gray-400" size={18} />
              <input
                type="email"
                placeholder="Email address"
                className="pl-10 w-full p-3 rounded-lg border focus:ring-2 focus:ring-purple-300"
              />
            </div>

            <div className="relative">
              <Phone className="absolute left-3 top-3 text-gray-400" size={18} />
              <input
                type="tel"
                placeholder="Phone / WhatsApp"
                className="pl-10 w-full p-3 rounded-lg border focus:ring-2 focus:ring-purple-300"
              />
            </div>

            <button className="w-full py-3 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 text-white font-medium shadow-md hover:opacity-90 transition">
              Subscribe
            </button>
          </div>

          <p className="text-xs text-gray-500 mt-4">
            By subscribing, you agree to our{' '}
            <a href="/privacy" className="underline">Privacy Policy</a>
          </p>

          {/* Payments */}
          <div className="mt-6">
            <p className="font-semibold text-purple-800 mb-2">We Accept</p>
            <div className="flex gap-4 text-purple-700">
              <CreditCard />
              <DollarSign />
              <Wallet />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-purple-200 py-6 text-center text-xs text-gray-500 px-6">
        © 2009–2025 <span className="font-medium text-purple-700">RAQSA</span>. All rights reserved.
        <div className="mt-2 space-x-2">
          <a href="/privacy" className="underline">Privacy</a> |
          <a href="/terms" className="underline">Terms</a> |
          <a href="/ip-notice" className="underline">IP Notice</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;