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
  await Movie.insertMany([
    { title: 'Inception', rating: 8.8, isReleased: true, genres: ['Action', 'Sci-Fi', 'Thriller'] },
    { title: 'The Conjuring', rating: 7.5, isReleased: true, genres: ['Horror', 'Mystery'] },
    { title: 'Dune: Part Two', rating: 8.9, isReleased: true, genres: ['Action', 'Adventure'] },
    { title: 'Avengers: Endgame', rating: 8.4, isReleased: false, genres: ['Action', 'Fantasy'] },
  ]);
  console.log('Da them 4 bo phim thanh cong.');
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
