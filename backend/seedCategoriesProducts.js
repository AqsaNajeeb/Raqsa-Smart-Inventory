import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Category from './models/Category.js';
import Product from './models/Product.js';
import User from './models/User.js';

dotenv.config();

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB connected for seeding');

    // Get a vendor (must exist from seedUsers.js)
    const vendor = await User.findOne({ role: 'vendor' });

    if (!vendor) {
      console.error('❌ No vendor found. Run seedUsers.js first.');
      process.exit(1);
    }

    // Clear existing data
    await Category.deleteMany();
    await Product.deleteMany();

    // Categories
    const categories = await Category.insertMany([
      {
        name: 'Male',
        image: '/images/male.jpg',
        subcategories: ['Clothing', 'Shoes', 'Accessories'],
      },
      {
        name: 'Female',
        image: '/images/female.jpg',
        subcategories: ['Clothing', 'Shoes', 'Cosmetics'],
      },
      {
        name: 'Kid',
        image: '/images/kid.jpg',
        subcategories: ['Clothing', 'Toys', 'Accessories'],
      },
    ]);

    // Helper to get category ID by name
    const getCategoryId = (name) => {
      const cat = categories.find((c) => c.name === name);
      if (!cat) throw new Error(`Category ${name} not found`);
      return cat._id;
    };

    // Products
    const products = [
      {
        name: "Men's T-Shirt",
        category: getCategoryId('Male'),
        subcategory: 'Clothing',
        price: 25,
        stockQuantity: 100,
        reorderLevel: 10,
        images: ['/images/1.jpg'],
        vendorId: vendor._id,
        isActive: true,
      },
      {
        name: "Women's Lipstick",
        category: getCategoryId('Female'),
        subcategory: 'Cosmetics',
        price: 15,
        stockQuantity: 50,
        reorderLevel: 5,
        images: ['/images/4.jpg'],
        vendorId: vendor._id,
        isActive: true,
      },
      {
        name: "Kid's Toy Car",
        category: getCategoryId('Kid'),
        subcategory: 'Toys',
        price: 30,
        stockQuantity: 40,
        reorderLevel: 5,
        images: ['/images/16.jpg'],
        vendorId: vendor._id,
        isActive: true,
      },
      {
        name: "Women's Formal Wear Shoes",
        category: getCategoryId('Female'),
        subcategory: 'Shoes',
        price: 36.99,
        stockQuantity: 60,
        reorderLevel: 10,
        images: ['/images/8.jpg'],
        vendorId: vendor._id,
        isActive: true,
  },
    ];

    await Product.insertMany(products);

    console.log('✅ Categories & Products seeded successfully');

    // Optional: Log inserted products for verification
    const allProducts = await Product.find().populate('category', 'name subcategories');
    console.log('Inserted Products:', allProducts);

    process.exit();
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
};

seedDB();
