import { useState } from "react";
import { X, ShoppingBag } from "lucide-react";

const SIZE_MAP = {
  Clothing: ["XS", "S", "M", "L", "XL"],
  Shoes: ["6", "7", "8", "9", "10"],
  KidClothing: ["2Y", "4Y", "6Y", "8Y"],
};

const ProductCard = ({ product }) => {
  const [preview, setPreview] = useState(false);
  const [showSizes, setShowSizes] = useState(false);
  const [selectedSize, setSelectedSize] = useState(null);

  const sizes =
    product.category === "Kid" && product.subcategory === "Clothing"
      ? SIZE_MAP.KidClothing
      : product.subcategory === "Clothing"
      ? SIZE_MAP.Clothing
      : product.subcategory === "Shoes"
      ? SIZE_MAP.Shoes
      : [];

  const handleAddToCart = () => {
    if (sizes.length > 0 && !selectedSize) {
      alert("Please select a size first");
      return;
    }
    console.log("Add to cart:", product._id, selectedSize);
  };

  return (
    <>
      {/* Product Image */}
      {/* Product Image */}
<img
  src={
    product.images?.[0]
      ? `${import.meta.env.VITE_API_URL}${product.images[0]}`
      : "/placeholder.png"
  }
  alt={product.name}
  className="cursor-pointer w-full h-64 object-cover rounded-xl shadow hover:shadow-lg transition"
  onClick={() => {
    setPreview(true);
    setShowSizes(false);
    setSelectedSize(null);
  }}
/>

{/* Preview Modal Image */}
<img
  src={
    product.images?.[0]
      ? `${import.meta.env.VITE_API_URL}${product.images[0]}`
      : "/placeholder.png"
  }
  alt={product.name}
  className="w-full h-80 object-cover rounded-xl"
/>


      {/* Preview Modal */}
      {preview && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50"
          onClick={() => setPreview(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white/80 backdrop-blur-md rounded-2xl shadow-2xl max-w-lg w-full p-6 relative"
          >
            {/* Close */}
            <button
              onClick={() => setPreview(false)}
              className="absolute top-4 right-4 text-gray-600 hover:text-black"
            >
              <X />
            </button>

            {/* Image */}
            <img
              src={product.images[0]}
              alt={product.name}
              className="w-full h-80 object-cover rounded-xl"
            />

            {/* Info */}
            <div className="mt-4">
              <h3 className="text-lg font-semibold text-purple-800">
                {product.name}
              </h3>
              <p className="text-purple-600 font-medium mt-1">
                ${product.price}
              </p>
            </div>

            {/* Size Selector */}
            {sizes.length > 0 && (
              <div className="mt-6">
                <button
                  onClick={() => setShowSizes(!showSizes)}
                  className="text-sm font-medium text-purple-700 underline"
                >
                  Select Size
                </button>

                {showSizes && (
                  <div className="flex flex-wrap gap-3 mt-3">
                    {sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`px-4 py-2 rounded-full text-sm border transition ${
                          selectedSize === size
                            ? "bg-purple-100 border-purple-500 text-purple-800"
                            : "border-gray-300 hover:border-purple-400"
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                )}

                {selectedSize && (
                  <p className="mt-3 text-sm font-medium text-purple-700">
                    Selected Size: {selectedSize}
                  </p>
                )}
              </div>
            )}

            {/* CTA */}
            <button
              onClick={handleAddToCart}
              className="mt-6 w-full flex items-center justify-center gap-2 py-3 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 text-white font-medium shadow-md hover:opacity-90 transition"
            >
              <ShoppingBag size={18} />
              Add to Cart
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ProductCard;
