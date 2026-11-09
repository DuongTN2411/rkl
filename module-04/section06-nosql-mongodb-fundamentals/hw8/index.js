const mongoose = require('mongoose');
require('dotenv').config();

const locationSchema = new mongoose.Schema(
  {
    street: { type: String, required: true },
    district: { type: String, required: true },
    city: { type: String, required: true },
  },
  { _id: false }
);

const storeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    location: { type: locationSchema, required: true },
  },
  { timestamps: true }
);

const Store = mongoose.model('Store', storeSchema);

async function main() {
  console.log('--- DANG TAO MOI CUA HANG ---');
  const store = new Store({
    name: 'Cua hang Tien loi 24/7',
    location: {
      street: '123 Duong Nguyen Hue',
      district: 'Quan 1',
      city: 'Ho Chi Minh',
    },
  });

  const saved = await store.save();
  console.log('=> Tao thanh cong! Cau truc JSON tra ve the hien ro quan he cha-con:');
  console.log(saved.toObject());
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
