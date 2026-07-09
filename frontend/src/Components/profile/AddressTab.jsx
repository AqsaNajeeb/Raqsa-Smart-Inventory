import React, { useEffect, useState } from 'react';
import { MapPin, Plus, Trash2, Pencil, X } from 'lucide-react';

const AddressTab = () => {
  const [addresses, setAddresses] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    fullName: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'Pakistan'
  });

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('shippingAddresses')) || [];
    setAddresses(saved);
  }, []);

  const persist = (updated) => {
    setAddresses(updated);
    localStorage.setItem('shippingAddresses', JSON.stringify(updated));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const allFilled = [
      form.fullName,
      form.phone,
      form.street,
      form.city,
      form.state,
      form.zipCode,
      form.country
    ].every(v => v.trim() !== '');

    if (!allFilled) {
      alert('Please fill all address fields');
      return;
    }

    if (editingId) {
      const updated = addresses.map(a =>
        a.id === editingId ? { ...a, ...form } : a
      );
      persist(updated);
    } else {
      const newAddress = {
        id: Date.now(),
        ...form
      };
      persist([...addresses, newAddress]);
    }

    setForm({
      fullName: '',
      phone: '',
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'Pakistan'
    });
    setEditingId(null);
    setShowForm(false);
  };

  const editAddress = (addr) => {
    setForm({
      fullName: addr.fullName || '',
      phone: addr.phone || '',
      street: addr.street || '',
      city: addr.city || '',
      state: addr.state || '',
      zipCode: addr.zipCode || '',
      country: addr.country || 'Pakistan'
    });

    setEditingId(addr.id);
    setShowForm(true);
  };

  const removeAddress = (id) => {
    const updated = addresses.filter(a => a.id !== id);
    persist(updated);
  };

  return (
    <div className="bg-white/70 backdrop-blur-md p-6 rounded-xl shadow-xl">
      <h2 className="text-xl font-semibold mb-6 text-purple-800 flex items-center gap-2">
        <MapPin size={20} /> Shipping Addresses
      </h2>

      {addresses.length === 0 && (
        <div className="text-center py-10">
          <MapPin size={48} className="mx-auto text-purple-400 mb-3" />
          <p className="text-purple-700 font-medium">No saved addresses</p>
          <p className="text-sm text-purple-500 mt-1">
            Add a shipping address for faster checkout.
          </p>
        </div>
      )}

      {addresses.length > 0 && (
        <div className="space-y-4">
          {addresses.map(addr => (
            <div
              key={addr.id}
              className="flex items-start justify-between p-4 border rounded-lg bg-white shadow-sm"
            >
              <div>
                <p className="font-medium text-purple-800">{addr.fullName}</p>
                <p className="text-sm text-gray-600">{addr.phone}</p>
                <p className="text-sm text-gray-600 mt-1">
                  {addr.street}, {addr.city}, {addr.state}, {addr.zipCode}, {addr.country}
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => editAddress(addr)}
                  className="text-purple-500 hover:text-purple-600"
                >
                  <Pencil size={18} />
                </button>
                <button
                  onClick={() => removeAddress(addr.id)}
                  className="text-red-500 hover:text-red-600"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <button
        onClick={() => {
          setShowForm(true);
          setEditingId(null);
          setForm({
            fullName: '',
            phone: '',
            street: '',
            city: '',
            state: '',
            zipCode: '',
            country: 'Pakistan'
          });
        }}
        className="mt-6 flex items-center gap-2 px-6 py-3 border border-purple-400 text-purple-700 rounded-full hover:bg-purple-50 transition"
      >
        <Plus size={18} /> Add Shipping Address
      </button>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 backdrop-blur-sm pt-24">
          <div className="relative w-full max-w-xl p-6 rounded-2xl bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100 shadow-2xl">
            <button
              onClick={() => setShowForm(false)}
              className="absolute top-3 right-3 text-purple-500 hover:text-purple-700"
            >
              <X size={18} />
            </button>

            <h3 className="text-lg font-semibold text-purple-800 mb-4">
              {editingId ? 'Edit Address' : 'Add Shipping Address'}
            </h3>

            <form onSubmit={handleSubmit} className="grid gap-3">
              <input className="p-3 rounded-lg border" placeholder="Full Name" value={form.fullName} onChange={e => setForm({ ...form, fullName: e.target.value })} />
              <input className="p-3 rounded-lg border" placeholder="Phone" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
              <input className="p-3 rounded-lg border" placeholder="Street / Area" value={form.street} onChange={e => setForm({ ...form, street: e.target.value })} />

              <div className="grid grid-cols-2 gap-3">
                <input className="p-3 rounded-lg border" placeholder="City" value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} />
                <input className="p-3 rounded-lg border" placeholder="State" value={form.state} onChange={e => setForm({ ...form, state: e.target.value })} />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <input className="p-3 rounded-lg border" placeholder="ZIP Code" value={form.zipCode} onChange={e => setForm({ ...form, zipCode: e.target.value })} />
                <input className="p-3 rounded-lg border" placeholder="Country" value={form.country} onChange={e => setForm({ ...form, country: e.target.value })} />
              </div>

              <button
                type="submit"
                className="mt-3 bg-gradient-to-r from-pink-400 to-purple-500 text-white py-3 rounded-full hover:opacity-90"
              >
                {editingId ? 'Update Address' : 'Save Address'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddressTab;
