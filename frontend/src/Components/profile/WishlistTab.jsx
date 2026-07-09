import React, { useState } from 'react';
import { Heart, Trash2 } from 'lucide-react';
import ProductModal from '../../pages/ProductModal';

const WishlistTab = ({ wishlist, setWishlist }) => {
  const [selectedProduct, setSelectedProduct] = useState(null);

  const removeFromWishlist = (id) => {
    const updated = wishlist.filter(item => item._id !== id);
    setWishlist(updated);
    localStorage.setItem('wishlist', JSON.stringify(updated));
  };

  return (
    <div className="bg-white/70 backdrop-blur-md p-6 rounded-xl shadow-xl">
      <h2 className="text-xl font-semibold mb-4 text-purple-800">
        Wishlist
      </h2>

      {wishlist.length === 0 ? (
        <div className="text-center py-10">
          <Heart className="mx-auto text-purple-400 mb-3" size={40} />
          <p className="text-purple-700 font-medium">
            Your wishlist is empty
          </p>
          <p className="text-sm text-purple-500 mt-1">
            Products you like will appear here.
          </p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
          {wishlist.map(item => (
            <div
              key={item._id}
              className="relative rounded-lg overflow-hidden shadow bg-white hover:shadow-md transition group"
            >
              <button
                onClick={() => removeFromWishlist(item._id)}
                className="absolute top-2 right-2 z-10 bg-white/80 p-1 rounded-full text-red-500 hover:bg-red-100"
              >
                <Trash2 size={16} />
              </button>

              <div onClick={() => setSelectedProduct(item)} className="cursor-pointer">
                <img
  src={
    item.images?.[0]
      ? `${import.meta.env.VITE_API_URL}${item.images[0]}`
      : "/placeholder.png"
  }
  alt={item.name}
  className="w-full h-40 object-cover"
/>

                <div className="p-3">
                  <p className="font-medium text-purple-800">
                    {item.name}
                  </p>
                  <p className="text-sm text-purple-600 mt-1">
                    ${Number(item.price).toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </div>
  );
};

export default WishlistTab;
