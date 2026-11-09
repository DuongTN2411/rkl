const mongoose = require('mongoose');
require('dotenv').config();

const movieSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    rating: { type: Number, required: true },
    isReleased: { type: Boolean, default: false },
    genres: { type: [String], default: [] },
  },
  { timestamps: true }
);

const Movie = mongoose.model('Movie', movieSchema);

async function main() {
  const results = await Movie.find({
    genres: { $in: ['Action', 'Horror'] },
    isReleased: true,
  });

  console.log('Cac bo phim thuoc the loai Hanh dong/Kinh di VA da phat hanh:');
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
