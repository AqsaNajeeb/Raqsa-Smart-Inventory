import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // ================= FETCH PRODUCTS =================
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await api.get('/products/my-products');
      const data = Array.isArray(res.data)
        ? res.data
        : Array.isArray(res.data.products)
        ? res.data.products
        : [];
      setProducts(data);
    } catch (err) {
      console.error('Failed to fetch products', err);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // ================= DELETE PRODUCT =================
  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    try {
      await api.delete(`/products/${id}`);
      setProducts(prev => prev.filter(p => p._id !== id));
    } catch (err) {
      console.error('Delete failed', err);
      alert('Failed to delete product.');
    }
  };

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-purple-700">My Products 🍭</h2>
      </div>

      {loading ? (
        <p className="text-purple-600">Loading products...</p>
      ) : products.length === 0 ? (
        <p className="text-pink-500 font-semibold">
          No products yet. Add your first product ✨
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {products.map(p => (
            <div
              key={p._id}
              className="bg-white/80 rounded-xl shadow-lg p-4 hover:shadow-xl transition"
            >
              <img
  src={
    p.images?.[0]
      ? `${import.meta.env.VITE_API_URL}${p.images[0]}`
      : "/placeholder.png"
  }
  alt={p.name}
  className="h-40 w-full object-cover rounded-lg mb-3"
/>

              <h3 className="font-semibold text-purple-700">{p.name}</h3>
              <p className="text-pink-500 font-medium">${p.price ?? 0}</p>
              <p className="text-sm text-gray-600">Stock: {p.stockQuantity ?? 0}</p>

              <div className="flex gap-2 mt-4">
                <button
                  onClick={() =>
                    navigate('/vendor/add-product', { state: { product: p } })
                  }
                  className="flex-1 py-2 rounded-lg bg-blue-400 text-white font-semibold hover:opacity-90"
                >
                  Edit
                </button>

                <button
                  onClick={() => handleDelete(p._id)}
                  className="flex-1 py-2 rounded-lg bg-red-400 text-white font-semibold hover:opacity-90"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default Products;
