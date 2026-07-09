import { useState, useEffect } from 'react';

const ProductForm = ({ initialData, onSubmit, loading }) => {
  const [form, setForm] = useState({
    name: '',
    price: '',
    category: '',
    stock: '',
    reorderLevel: '',
    image: ''
  });

  useEffect(() => {
    if (initialData) {
      setForm({
        name: initialData.name || '',
        price: initialData.price || '',
        category: initialData.category || '',
        stock: initialData.stock || '',
        reorderLevel: initialData.reorderLevel || '',
        image: initialData.image || ''
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(form);
      }}
      className="bg-white/80 rounded-2xl p-6 shadow-lg grid grid-cols-1 md:grid-cols-2 gap-4"
    >
      <input name="name" placeholder="Product Name" className="input" value={form.name} onChange={handleChange} required />
      <input name="price" type="number" placeholder="Price" className="input" value={form.price} onChange={handleChange} required />
      <input name="category" placeholder="Category" className="input" value={form.category} onChange={handleChange} required />
      <input name="stock" type="number" placeholder="Stock Quantity" className="input" value={form.stock} onChange={handleChange} required />
      <input name="reorderLevel" type="number" placeholder="Reorder Level" className="input" value={form.reorderLevel} onChange={handleChange} required />
      <input name="image" placeholder="Image URL" className="input" value={form.image} onChange={handleChange} />

      <button
        disabled={loading}
        className="col-span-full py-3 rounded-xl bg-gradient-to-r from-pink-400 to-purple-500 text-white font-semibold"
      >
        {loading ? 'Saving...' : 'Save Product'}
      </button>
    </form>
  );
};

export default ProductForm;
