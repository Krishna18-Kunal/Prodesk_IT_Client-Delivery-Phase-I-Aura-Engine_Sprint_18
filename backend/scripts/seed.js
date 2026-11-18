import 'dotenv/config';
import mongoose from 'mongoose';
import { faker } from '@faker-js/faker';
import Product from '../src/models/Product.js';

const TOTAL = 50000;
const BATCH_SIZE = 1000;
const categories = ['Electronics', 'Apparel', 'Home & Kitchen', 'Sports', 'Beauty', 'Toys', 'Automotive', 'Grocery', 'Office Supplies', 'Footwear'];
const productTypes = {
  Electronics: ['Wireless Headphones', 'Laptop', 'Bluetooth Speaker', 'Smart Watch', 'USB-C Hub', 'Monitor'],
  Apparel: ['Cotton T-Shirt', 'Denim Jacket', 'Running Shorts', 'Winter Hoodie'],
  'Home & Kitchen': ['Air Fryer', 'Coffee Maker', 'Storage Set', 'Desk Lamp'],
  Sports: ['Yoga Mat', 'Dumbbell Set', 'Water Bottle', 'Tennis Racket'],
  Beauty: ['Face Cleanser', 'Hair Dryer', 'Moisturizer', 'Skin Care Kit'],
  Toys: ['Building Blocks', 'Puzzle Set', 'Remote Control Car'],
  Automotive: ['Car Charger', 'Floor Mats', 'Dash Camera'],
  Grocery: ['Coffee Beans', 'Protein Bars', 'Olive Oil'],
  'Office Supplies': ['Notebook Pack', 'Ergonomic Chair', 'Wireless Mouse'],
  Footwear: ['Running Shoes', 'Casual Sneakers', 'Hiking Boots'],
};

async function seed() {
  if (!process.env.MONGODB_URI) throw new Error('MONGODB_URI is required');
  await mongoose.connect(process.env.MONGODB_URI);
  console.log(`Connected. Replacing collection with ${TOTAL} synthetic products...`);
  await Product.deleteMany({});
  await Product.init();

  let inserted = 0;
  for (let start = 0; start < TOTAL; start += BATCH_SIZE) {
    const batch = Array.from({ length: Math.min(BATCH_SIZE, TOTAL - start) }, (_, index) => {
      const category = faker.helpers.arrayElement(categories);
      const type = faker.helpers.arrayElement(productTypes[category]);
      const price = Number(faker.number.float({ min: 8, max: 1800, fractionDigits: 2 }));
      const cost = Number((price * faker.number.float({ min: 0.35, max: 0.82, fractionDigits: 2 })).toFixed(2));
      return {
        productName: `${faker.commerce.productAdjective()} ${type}`,
        sku: `AUR-${String(start + index + 1).padStart(6, '0')}`,
        category,
        price,
        cost,
        stockQuantity: faker.helpers.arrayElement([0, 1, 2, 5, 8, 12, 18, 25, 40, 60, 100, 150, 250, 500]),
        reorderLevel: faker.number.int({ min: 10, max: 50 }),
        lastUpdated: faker.date.recent({ days: 90 }),
      };
    });
    await Product.insertMany(batch, { ordered: false });
    inserted += batch.length;
    console.log(`Inserted ${inserted}/${TOTAL}`);
  }
  console.log('Seeding complete.');
}

seed()
  .catch((error) => {
    console.error('Seeding failed:', error);
    process.exitCode = 1;
  })
  .finally(async () => mongoose.disconnect());
