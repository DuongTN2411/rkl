const mongoose = require('mongoose');
require('dotenv').config();

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, minLength: 5 },
    price: { type: Number, required: true, min: 0 },
    category: { type: String, required: true },
  },
  { timestamps: true }
);

const Product = mongoose.model('Product', productSchema);

async function main() {
  await Product.deleteMany({});
  await Product.insertMany([
    { name: 'Laptop Dell Cu', price: 10000, category: 'Laptop' },
    { name: 'iPhone 12 Pro Cu', price: 15000, category: 'Mobile' },
    { name: 'Laptop Moi', price: 25000, category: 'Laptop', stock: 5 },
  ]);

  const before = await Product.find({ stock: { $exists: false } });
  console.log('[1] TRUOC KHI CHAY SCRIPT (san pham chua co truong "stock"):');
  console.log(before);

  const result = await Product.updateMany(
    { stock: { $exists: false } },
    { $set: { stock: 10 } }
  );
  console.log('\nSo san pham da cap nhat:', result.modifiedCount);

  const after = await Product.find({ stock: 10 });
  console.log('\n[2] SAU KHI CHAY SCRIPT (tat ca san pham cu da duoc bo sung "stock: 10"):');
  console.log(after);
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
