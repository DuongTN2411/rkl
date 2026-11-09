const mongoose = require('mongoose');
require('dotenv').config();

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Ten san pham la bat buoc'],
      minLength: [5, 'Ten san pham phai co toi thieu 5 ky tu'],
    },
    price: {
      type: Number,
      required: true,
      min: [0, 'Gia khong duoc am'],
    },
    category: { type: String, required: true },
  },
  { timestamps: true }
);

const Product = mongoose.model('Product', productSchema);

async function main() {
  await Product.deleteMany({});
  await Product.insertMany([
    { name: 'Laptop Dell XPS 13', price: 15000, category: 'Laptop' },
    { name: 'iPhone 14 Pro', price: 18000, category: 'Mobile' },
    { name: 'Samsung Galaxy S23', price: 22000, category: 'Mobile' },
    { name: 'MacBook Pro 14', price: 35000, category: 'Laptop' },
    { name: 'iPad Air', price: 12000, category: 'Tablet' },
  ]);

  const results = await Product.find({
    $or: [{ category: { $in: ['Laptop', 'Mobile'] } }],
    price: { $lt: 20000 },
  });

  console.log('=> Danh sach San pham (Laptop / Mobile) co gia < 20.000:');
  console.log(results);
}

async function run() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Ket noi MongoDB thanh cong!');
    await main();
  } catch (err) {
    console.error('Loi:', err.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
    console.log('Da dong ket noi MongoDB.');
  }
}

run();
