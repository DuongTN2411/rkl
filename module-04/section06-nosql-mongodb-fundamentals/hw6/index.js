const mongoose = require('mongoose');
require('dotenv').config();

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Ten san pham phai co toi thieu 5 ky tu'],
      minLength: [5, 'Ten san pham phai co toi thieu 5 ky tu'],
    },
    price: {
      type: Number,
      required: [true, 'Gia san pham khong duoc de trong'],
      min: [0, 'Gia san pham khong duoc la so am'],
    },
    category: {
      type: String,
      required: [true, 'Danh muc la bat buoc'],
    },
  },
  { timestamps: true }
);

const Product = mongoose.model('Product', productSchema);

async function main() {
  console.log('\n--- TEST 1: LUU SAN PHAM HOP LE ---');
  try {
    const valid = new Product({ name: 'Laptop Dell XPS', price: 25000000, category: 'Laptop' });
    const saved = await valid.save();
    console.log('=> Luu THANH CONG san pham hop le:');
    console.log('ID:', saved._id);
    console.log('Tao luc:', saved.createdAt);
  } catch (err) {
    console.error('=> Loi khong mong doi:', err.message);
  }

  console.log('\n--- TEST 2: LUU SAN PHAM VI PHAM VALIDATION ---');
  try {
    console.log('=> Dang co gang luu san pham loi vao DB...');
    const invalid = new Product({ name: 'ABC', price: -100, category: 'Laptop' });
    await invalid.save();
  } catch (err) {
    console.log('\n[!] BAT DUOC LOI VALIDATION:');
    Object.values(err.errors).forEach((e) => console.log('-', e.message));
  }
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
    console.log('\nDa dong ket noi MongoDB.');
  }
}

run();
