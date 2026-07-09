// src/pages/categories.js
export const categories = [
  {
    id: 1,
    name: "Male",
    image: "/images/male.jpg",
    subcategories: ["Clothing", "Shoes", "Accessories"]
  },
  {
    id: 2,
    name: "Female",
    image: "/images/female.jpg",
    subcategories: ["Clothing", "Shoes", "Cosmetics"]
  },
  {
    id: 3,
    name: "Kid",
    image: "/images/kid.jpg",
    subcategories: ["Clothing", "Toys", "Accessories"]
  }
];

export const products = [
  {
    id: 1,
    name: "Men's T-Shirt",
    category: "Male",
    subcategory: "Clothing",
    price: 25,
    images: ["/images/1.jpg", "/images/1.jpg"],
    description: "Comfortable cotton T-shirt, perfect for casual wear.",
    features: ["100% cotton", "Breathable material", "Available in multiple colors"],
    specifications: "Sizes: S, M, L, XL\nColor: Black, White, Blue"
  },
  {
    id: 2,
    name: "Women's Lipstick",
    category: "Female",
    subcategory: "Cosmetics",
    price: 15,
    images: ["/images/4.jpg", "/images/4.jpg"],
    description: "Long-lasting lipstick with vibrant colors for every occasion.",
    features: ["Moisturizing formula", "Smudge-proof", "10 shades available"],
    specifications: "Net weight: 4g\nIngredients: Natural oils and pigments"
  },
  {
    id: 3,
    name: "Kid's Toy Car",
    category: "Kid",
    subcategory: "Toys",
    price: 30,
    images: ["/images/16.jpg"],
    description: "Fun and durable toy car for hours of imaginative play.",
    features: ["Battery operated", "Bright colors", "Safe for ages 3+"],
    specifications: "Material: Plastic\nDimensions: 20cm x 10cm x 8cm"
  },
  {
    id: 4,
    name: "Men's T-Shirt Full Sleeves",
    category: "Male",
    subcategory: "Clothing",
    price: 20,
    images: ["/images/2.jpg", "/images/2.jpg"],
    description: "Full-sleeve cotton T-shirt, ideal for cooler days.",
    features: ["Soft cotton", "Full sleeves", "Casual design"],
    specifications: "Sizes: S, M, L, XL\nColor: Grey, Navy"
  },
  {
    id: 5,
    name: "Men's Trouser",
    category: "Male",
    subcategory: "Clothing",
    price: 25,
    images: ["/images/3.jpg", "/images/3.jpg"],
    description: "Classic formal trousers made from soft, breathable fabric.",
    features: ["Comfortable fit", "Breathable", "Durable material"],
    specifications: "Sizes: 30, 32, 34, 36\nColors: Black, Navy"
  },
  {
    id: 6,
    name: "Men's Casual Trouser",
    category: "Male",
    subcategory: "Clothing",
    price: 5,
    images: ["/images/5.jpg", "/images/5.jpg"],
    description: "Affordable casual trousers for everyday comfort.",
    features: ["Lightweight", "Flexible waist", "Easy to wash"],
    specifications: "Sizes: 30-36\nColors: Khaki, Grey"
  },
  {
    id: 7,
    name: "Women's Lipstick Budget",
    category: "Female",
    subcategory: "Cosmetics",
    price: 5,
    images: ["/images/6.jpg", "/images/6.jpg"],
    description: "Budget-friendly lipstick with a smooth finish.",
    features: ["Smooth application", "Affordable", "Lightweight"],
    specifications: "Net weight: 3.5g\nIngredients: Natural waxes and pigments"
  },
  {
    id: 8,
    name: "Women's Shoes Classic",
    category: "Female",
    subcategory: "Shoes",
    price: 15,
    images: ["/images/7.jpg", "/images/7.jpg"],
    description: "Stylish shoes for everyday use or casual outings.",
    features: ["Comfortable sole", "Elegant design", "Lightweight"],
    specifications: "Sizes: 5-10\nColors: Black, Brown"
  },
  {
    id: 9,
    name: "Women's Shoes Sporty",
    category: "Female",
    subcategory: "Shoes",
    price: 15,
    images: ["/images/8.jpg", "/images/8.jpg"],
    description: "Comfortable and durable shoes with a modern design.",
    features: ["Non-slip sole", "Cushioned", "Durable material"],
    specifications: "Sizes: 5-10\nColors: White, Pink"
  },
  {
    id: 10,
    name: "Women's Top",
    category: "Female",
    subcategory: "Clothing",
    price: 10,
    images: ["/images/9.jpg", "/images/9.jpg"],
    description: "Lightweight top with elegant design, perfect for casual wear.",
    features: ["Soft fabric", "Elegant cut", "Available in multiple colors"],
    specifications: "Sizes: S, M, L\nColors: White, Pink, Blue"
  },
  {
    id: 11,
    name: "Men's Shoes",
    category: "Male",
    subcategory: "Shoes",
    price: 10,
    images: ["/images/11.jpg", "/images/11.jpg"],
    description: "Classic sneakers suitable for both casual and sporty looks.",
    features: ["Rubber sole", "Breathable upper", "Lace-up design"],
    specifications: "Sizes: 7-12\nColors: Black, Grey"
  },
  {
    id: 12,
    name: "Men's Accessories Deal",
    category: "Male",
    subcategory: "Accessories",
    price: 50,
    images: ["/images/12.jpg", "/images/12.jpg"],
    description: "Complete accessories package: belts, watches, and more.",
    features: ["Stylish accessories", "High-quality material", "Mix & match items"],
    specifications: "Includes: 1 belt, 1 watch, 1 wallet"
  },
  {
    id: 13,
    name: "Men's Belt",
    category: "Male",
    subcategory: "Accessories",
    price: 20,
    images: ["/images/13.jpg", "/images/13.jpg"],
    description: "High-quality leather belt, perfect for formal and casual wear.",
    features: ["Genuine leather", "Adjustable", "Classic buckle"],
    specifications: "Length: 100-120cm\nColors: Black, Brown"
  },
  {
    id: 14,
    name: "Kids Accessories Deal",
    category: "Kid",
    subcategory: "Accessories",
    price: 50,
    images: ["/images/14.jpg", "/images/14.jpg"],
    description: "A mix of toys and essentials for kids' fun and style.",
    features: ["Fun toys", "Practical items", "Safe and durable"],
    specifications: "Includes: toy, hat, backpack"
  },
  {
    id: 15,
    name: "Baby Aspen Little Princess Hooded Spa Robe Pink White",
    category: "Kid",
    subcategory: "Accessories",
    price: 20,
    images: ["/images/15.jpg", "/images/15.jpg"],
    description: "Soft, plush spa robe for babies, keeps them cozy and adorable.",
    features: ["Ultra-soft fabric", "Hooded design", "Machine washable"],
    specifications: "Size: 0-12 months\nColor: Pink & White"
  }
];
