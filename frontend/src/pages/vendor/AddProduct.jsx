import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../../api/axios';

const AddProduct = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const editProduct = location.state?.product || null;

  const [form, setForm] = useState({
    name: '',
    category: '',
    subcategory: '',
    price: '',
    stockQuantity: '',
    reorderLevel: '',
    description: ''
  });

  const [categories, setCategories] = useState([]);
  const [images, setImages] = useState([]); // existing images from DB
  const [imageFiles, setImageFiles] = useState([]); // new files to upload
  const [loading, setLoading] = useState(false);

  /* ================= PREFILL EDIT MODE ================= */
  useEffect(() => {
    if (editProduct) {
      setForm({
        name: editProduct.name || '',
        category:
          typeof editProduct.category === 'object'
            ? editProduct.category._id
            : editProduct.category || '',
        subcategory: editProduct.subcategory || '',
        price: editProduct.price || '',
        stockQuantity: editProduct.stockQuantity || '',
        reorderLevel: editProduct.reorderLevel || '',
        description: editProduct.description || '',
      });

      setImages(Array.isArray(editProduct.images) ? editProduct.images : []);
    }
  }, [editProduct]);

  /* ================= FETCH CATEGORIES ================= */
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get('/categories');
        if (res.data?.success && Array.isArray(res.data.categories)) {
          setCategories(
            res.data.categories.map((cat) => ({
              _id: cat._id,
              name: cat.name,
            }))
          );
        } else {
          setCategories([]);
        }
      } catch (err) {
        console.error('Failed to fetch categories', err);
      }
    };
    fetchCategories();
  }, []);

  /* ================= HANDLE FORM CHANGE ================= */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  /* ================= HANDLE IMAGE FILES ================= */
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImageFiles(files);
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('name', form.name);
      formData.append('category', form.category);
      formData.append('subcategory', form.subcategory);
      formData.append('price', Number(form.price));
      formData.append('stockQuantity', Number(form.stockQuantity));
      formData.append('reorderLevel', Number(form.reorderLevel));
      formData.append('description', form.description);

      // Append multiple images
      imageFiles.forEach((file) => {
        formData.append('images', file); // key must match backend's upload.array('images')
      });

      if (editProduct) {
        await api.put(`/products/${editProduct._id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      } else {
        await api.post('/products', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      }

      alert('Product saved successfully!');
      navigate('/vendor/products');
    } catch (err) {
      console.error('Product save failed', err);
      alert('Failed to save product. Check console for details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <h2 className="text-2xl font-bold text-purple-700 mb-6">
        {editProduct ? 'Edit Product' : 'Add Product'}
      </h2>

      <form
        onSubmit={handleSubmit}
        className="bg-white/70 p-6 rounded-2xl shadow-md max-w-xl"
      >
        {/* Product Name */}
        <div className="mb-4">
          <label className="block font-semibold text-purple-700 mb-1">Name</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            className="w-full p-2 rounded-lg border border-purple-300"
          />
        </div>

        {/* Category */}
        <div className="mb-4">
          <label className="block font-semibold text-purple-700 mb-1">Category</label>
          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            required
            className="w-full p-2 rounded-lg border border-purple-300"
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Subcategory */}
        <div className="mb-4">
          <label className="block font-semibold text-purple-700 mb-1">Subcategory</label>
          <input
            type="text"
            name="subcategory"
            value={form.subcategory}
            onChange={handleChange}
            className="w-full p-2 rounded-lg border border-purple-300"
          />
        </div>

        {/* Price & Stock */}
        <div className="mb-4 grid grid-cols-2 gap-4">
          <div>
            <label className="block font-semibold text-purple-700 mb-1">Price ($)</label>
            <input
              type="number"
              step="0.01"
              name="price"
              value={form.price}
              onChange={handleChange}
              required
              className="w-full p-2 rounded-lg border border-purple-300"
            />
          </div>

          <div>
            <label className="block font-semibold text-purple-700 mb-1">Stock Quantity</label>
            <input
              type="number"
              name="stockQuantity"
              value={form.stockQuantity}
              onChange={handleChange}
              required
              className="w-full p-2 rounded-lg border border-purple-300"
            />
          </div>
        </div>

        {/* Reorder Level */}
        <div className="mb-4">
          <label className="block font-semibold text-purple-700 mb-1">Reorder Level</label>
          <input
            type="number"
            name="reorderLevel"
            value={form.reorderLevel}
            onChange={handleChange}
            className="w-full p-2 rounded-lg border border-purple-300"
          />
        </div>

        {/* Description */}
        <div className="mb-4">
          <label className="block font-semibold text-purple-700 mb-1">Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows="4"
            className="w-full p-2 rounded-lg border border-purple-300"
          />
        </div>

        {/* Image Upload */}
        <div className="mb-6">
          <label className="block font-semibold text-purple-700 mb-1">Product Images</label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageChange}
          />
          <div className="mt-3 flex gap-2 flex-wrap">
            {/* Preview newly selected files */}
            {imageFiles.length > 0 &&
              imageFiles.map((file, i) => (
                <img
                  key={i}
                  src={URL.createObjectURL(file)}
                  alt="Preview"
                  className="h-32 w-32 object-cover rounded-lg border"
                />
              ))}

            {/* Existing images from DB */}
            {!imageFiles.length &&
              images.length > 0 &&
              images.map((img, i) => (
                <img
                  key={i}
                  src={`${import.meta.env.VITE_API_URL}${img}`}
                  alt={form.name}
                  className="h-32 w-32 object-cover rounded-lg border"
                />
              ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 bg-pink-500 text-white rounded-lg font-semibold hover:opacity-90"
        >
          {loading ? 'Saving...' : editProduct ? 'Update Product' : 'Add Product'}
        </button>
      </form>
    </>
  );
};

export default AddProduct;
