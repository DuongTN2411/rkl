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

const orderSchema = new mongoose.Schema(
  {
    orderNumber: { type: String, required: true },
    product_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    quantity: { type: Number, required: true, min: 1 },
  },
  { timestamps: true }
);

const Product = mongoose.model('Product', productSchema);
const Order = mongoose.model('Order', orderSchema);

async function main() {
  await Product.deleteMany({});
  await Order.deleteMany({});

  console.log('--- DANG TAO DU LIEU MAU ---');
  const product = await Product.create({
    name: 'iPhone 15 Pro Max',
    price: 30000,
    category: 'Mobile',
  });
  console.log('=> Da tao San pham:', product.name);

  const order = await Order.create({
    orderNumber: 'ORD-2023-001',
    product_id: product._id,
    quantity: 2,
  });
  console.log('=> Da tao Don hang:', order.orderNumber);

  console.log('\n--- [1] KET QUA KHI KHONG DUNG POPULATE ---');
  const orderWithoutPopulate = await Order.findById(order._id);
  console.log(orderWithoutPopulate.toObject());

  console.log('\n--- [2] KET QUA SAU KHI DUNG POPULATE ---');
  const orderWithPopulate = await Order.findById(order._id).populate('product_id');
  console.log(orderWithPopulate.toObject());
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
