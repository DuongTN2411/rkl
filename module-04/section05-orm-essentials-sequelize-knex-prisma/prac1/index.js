const sequelize = require('./config/database');
const Book = require('./models/book');

async function main() {
  try {
    await sequelize.authenticate();
    console.log('Ket noi MySQL thanh cong.');

    await sequelize.sync();
    console.log('Dong bo model thanh cong, bang "' + Book.getTableName() + '" da san sang.');
  } catch (error) {
    console.error('Ket noi that bai:', error.message);
    process.exitCode = 1;
  } finally {
    await sequelize.close();
  }
}

main();
