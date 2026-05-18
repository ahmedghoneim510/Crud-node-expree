require('dotenv').config();

const mongoose = require('mongoose');
const config = require('./config');
const User = require('./modules/users/user.model');
const Category = require('./modules/categories/category.model');
const Product = require('./modules/products/product.model');

const seedData = async () => {
  try {
    await mongoose.connect(config.mongodbUri);
    console.log('Connected to MongoDB for seeding...');

    // Clear existing data
    await User.deleteMany({});
    await Category.deleteMany({});
    await Product.deleteMany({});
    console.log('Cleared existing data');

    // Create users
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'admin123',
      role: 'admin',
    });

    await User.create({
      name: 'John Doe',
      email: 'john@example.com',
      password: 'user123',
      role: 'user',
    });

    console.log('Users seeded');

    // Create categories
    const categories = await Category.create([
      { name: 'Electronics' },
      { name: 'Clothing' },
      { name: 'Books' },
      { name: 'Home & Garden' },
      { name: 'Sports' },
    ]);

    console.log('Categories seeded');

    // Create products
    const products = [
      {
        title: 'Wireless Bluetooth Headphones',
        description: 'High-quality wireless headphones with noise cancellation and 30-hour battery life.',
        price: 79.99,
        categoryId: categories[0]._id,
        createdBy: admin._id,
      },
      {
        title: 'Smartphone Stand',
        description: 'Adjustable aluminum smartphone stand compatible with all phone sizes and tablets.',
        price: 24.99,
        categoryId: categories[0]._id,
        createdBy: admin._id,
      },
      {
        title: 'Cotton T-Shirt',
        description: 'Premium 100% organic cotton t-shirt available in multiple colors and sizes.',
        price: 19.99,
        categoryId: categories[1]._id,
        createdBy: admin._id,
      },
      {
        title: 'JavaScript: The Good Parts',
        description: 'A deep dive into the best features of JavaScript by Douglas Crockford.',
        price: 29.99,
        categoryId: categories[2]._id,
        createdBy: admin._id,
      },
      {
        title: 'Indoor Plant Pot Set',
        description: 'Set of 3 ceramic plant pots with drainage holes, perfect for indoor plants.',
        price: 34.99,
        categoryId: categories[3]._id,
        createdBy: admin._id,
      },
      {
        title: 'Yoga Mat',
        description: 'Non-slip eco-friendly yoga mat with carrying strap, 6mm thick for comfort.',
        price: 39.99,
        categoryId: categories[4]._id,
        createdBy: admin._id,
      },
      {
        title: 'USB-C Hub',
        description: 'Multi-port USB-C hub with HDMI, USB 3.0, SD card reader, and power delivery.',
        price: 49.99,
        categoryId: categories[0]._id,
        createdBy: admin._id,
      },
      {
        title: 'Running Shoes',
        description: 'Lightweight breathable running shoes with cushioned sole for maximum comfort.',
        price: 89.99,
        categoryId: categories[4]._id,
        createdBy: admin._id,
      },
    ];

    await Product.create(products);
    console.log('Products seeded');

    console.log('\n--- Seed Complete ---');
    console.log('Admin: admin@example.com / admin123');
    console.log('User:  john@example.com / user123');

    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error.message);
    process.exit(1);
  }
};

seedData();
