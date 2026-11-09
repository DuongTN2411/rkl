const mongoose = require('mongoose');
require('dotenv').config();

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    age: { type: Number, required: true },
  },
  { timestamps: true }
);

const User = mongoose.model('User', userSchema);

async function main() {
  await User.insertMany([
    { name: 'Nguyen Van A', age: 25 },
    { name: 'Tran Thi B', age: 28 },
    { name: 'Le Van C', age: 22 },
  ]);
  console.log('Da them 3 nguoi dung thanh cong.');
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
