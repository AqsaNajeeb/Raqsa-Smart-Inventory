import api from './axios';

// PRODUCTS
export const getVendorProducts = () => api.get('/products/my-products');
export const createProduct = (data) => api.post('/products', data);
export const updateProduct = (id, data) => api.put(`/products/${id}`, data);
export const deleteProduct = (id) => api.delete(`/products/${id}`);

// LOW STOCK
export const getLowStockProducts = () => api.get('/products/low-stock');

// ORDERS
export const getVendorOrders = () => api.get('/orders/vendor');
