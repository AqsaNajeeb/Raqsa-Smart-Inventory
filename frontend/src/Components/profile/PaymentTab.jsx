import React, { useEffect, useState } from 'react';
import { CreditCard, Plus, Trash2, Pencil, X } from 'lucide-react';

const PaymentTab = () => {
  const [cards, setCards] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    name: '',
    number: '',
    expMonth: '',
    expYear: '',
    brand: ''
  });

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('paymentCards')) || [];
    setCards(saved);
  }, []);

  const persist = (updated) => {
    setCards(updated);
    localStorage.setItem('paymentCards', JSON.stringify(updated));
  };

  const removeCard = (id) => {
    const updated = cards.filter(c => c.id !== id);
    persist(updated);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const pattern = /^\d{4}\s\d{4}\s\d{4}\s\d{4}$/;
    if (!pattern.test(form.number)) {
      alert('Card number must be in format: xxxx xxxx xxxx xxxx (16 digits)');
      return;
    }

    const last4 = form.number.slice(-4);

    if (editingId) {
      const updated = cards.map(c =>
        c.id === editingId ? { ...c, ...form, last4 } : c
      );
      persist(updated);
    } else {
      const newCard = {
        id: Date.now(),
        ...form,
        last4
      };
      persist([...cards, newCard]);
    }

    setForm({ name: '', number: '', expMonth: '', expYear: '', brand: '' });
    setEditingId(null);
    setShowForm(false);
  };

  const editCard = (card) => {
    setForm({
      name: card.name,
      number: card.number,
      expMonth: card.expMonth,
      expYear: card.expYear,
      brand: card.brand
    });
    setEditingId(card.id);
    setShowForm(true);
  };

  return (
    <div className="bg-white/70 backdrop-blur-md p-6 rounded-xl shadow-xl">
      <h2 className="text-xl font-semibold mb-6 text-purple-800 flex items-center gap-2">
        <CreditCard size={20} /> Payment Methods
      </h2>

      {showForm && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
    <div className="relative w-11/12 max-w-lg p-6 rounded-2xl bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100 shadow-2xl">
      <button
        onClick={() => setShowForm(false)}
        className="absolute top-3 right-3 text-purple-500 hover:text-purple-700"
      >
        <X size={18} />
      </button>

      <h3 className="text-lg font-semibold text-purple-800 mb-4">
        {editingId ? 'Edit Card' : 'Add New Card'}
      </h3>

      <form onSubmit={handleSubmit} className="grid gap-4">
        <input
          className="p-3 rounded-lg border focus:outline-purple-400"
          placeholder="Card Holder Name"
          value={form.name}
          onChange={e => setForm({ ...form, name: e.target.value })}
          required
        />

        <input
          className="p-3 rounded-lg border focus:outline-purple-400"
          placeholder="xxxx xxxx xxxx xxxx"
          value={form.number}
          onChange={e => setForm({ ...form, number: e.target.value })}
          required
        />

        <div className="grid grid-cols-3 gap-3">
          <input
            className="p-3 rounded-lg border"
            placeholder="MM"
            value={form.expMonth}
            onChange={e => setForm({ ...form, expMonth: e.target.value })}
            required
          />
          <input
            className="p-3 rounded-lg border"
            placeholder="YY"
            value={form.expYear}
            onChange={e => setForm({ ...form, expYear: e.target.value })}
            required
          />
          <select
            className="p-3 rounded-lg border bg-white"
            value={form.brand}
            onChange={e => setForm({ ...form, brand: e.target.value })}
            required
          >
            <option value="">Brand</option>
            <option value="Visa">Visa</option>
            <option value="MasterCard">MasterCard</option>
            <option value="Amex">Amex</option>
          </select>
        </div>

        <button
          type="submit"
          className="mt-2 bg-gradient-to-r from-pink-400 to-purple-500 text-white py-3 rounded-full hover:opacity-90"
        >
          {editingId ? 'Update Card' : 'Save Card'}
        </button>
      </form>
    </div>
  </div>
)}

      {cards.length === 0 && (
        <div className="text-center py-10">
          <CreditCard size={48} className="mx-auto text-purple-400 mb-3" />
          <p className="text-purple-700 font-medium">No saved payment methods</p>
          <p className="text-sm text-purple-500 mt-1">
            Add a card to speed up your checkout.
          </p>
        </div>
      )}

      {cards.length > 0 && (
        <div className="space-y-4">
          {cards.map(card => (
            <div
              key={card.id}
              className="flex items-center justify-between p-4 border rounded-lg bg-white shadow-sm"
            >
              <div className="flex items-center gap-4">
                <CreditCard className="text-purple-500" />
                <div>
                  <p className="font-medium">
                    {card.brand} •••• {card.last4}
                  </p>
                  <p className="text-sm text-gray-500">
                    Expires {card.expMonth}/{card.expYear}
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => editCard(card)}
                  className="text-purple-500 hover:text-purple-600"
                >
                  <Pencil size={18} />
                </button>
                <button
                  onClick={() => removeCard(card.id)}
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
          setForm({ name: '', number: '', expMonth: '', expYear: '', brand: '' });
        }}
        className="mt-6 flex items-center gap-2 px-6 py-3 border border-purple-400 text-purple-700 rounded-full hover:bg-purple-50 transition"
      >
        <Plus size={18} /> Add New Card
      </button>

    </div>
  );
};

export default PaymentTab;
