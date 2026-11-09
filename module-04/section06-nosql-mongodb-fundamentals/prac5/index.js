const mongoose = require('mongoose');
require('dotenv').config();

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    age: { type: Number, required: true },
    address: {
      city: { type: String },
      country: { type: String },
    },
  },
  { timestamps: false }
);

const User = mongoose.model('User', userSchema);

async function main() {
  await User.deleteMany({});
  await User.insertMany([
    { name: 'Nguyen Van A', age: 25, address: { city: 'Hanoi', country: 'Vietnam' } },
    { name: 'Tran Thi B', age: 18, address: { city: 'Hanoi', country: 'Vietnam' } },
    { name: 'Le Van C', age: 30, address: { city: 'HCM', country: 'Vietnam' } },
    { name: 'Pham Thi D', age: 30, address: { city: 'Hanoi', country: 'Vietnam' } },
  ]);

  const results = await User.find({
    'address.city': 'Hanoi',
    age: { $gt: 20 },
  });

  console.log('--- KET QUA TRUY VAN ---');
  console.log('Danh sach nguoi dung o Hanoi va lon hon 20 tuoi:');
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
