const sequelize = require('./config/database');
const Book = require('./models/book');

async function main() {
  try {
    await sequelize.authenticate({ logging: false });
    await Book.sync({ logging: false });

    console.log('\n=== Buoc 1: bulkCreate 3 ban ghi ===');
    const created = await Book.bulkCreate([
      { title: 'Lap trinh Node.js', author: 'Nguyen Van A', price: 120000 },
      { title: 'Co so du lieu MySQL', author: 'Tran Thi B', price: 95000 },
      { title: 'Thiet ke REST API', author: 'Le Van C', price: 150000 },
    ]);
    console.log('Da tao ' + created.length + ' ban ghi.');

    console.log('\n=== Buoc 2: findAll ===');
    const all = await Book.findAll();
    console.log('So luong ban ghi: ' + all.length);
    console.log(all.map((book) => book.toJSON()));

    const id = all[0].id;

    console.log('\n=== Buoc 3: findByPk(' + id + ') ===');
    const one = await Book.findByPk(id);
    console.log('Ban ghi tim duoc:', one.toJSON());

    console.log('\n=== Buoc 4: update gia ban ghi id=' + id + ' ===');
    const price = one.price + 10000;
    const [affected] = await Book.update({ price }, { where: { id } });
    console.log('Gia moi: ' + price + ', so dong bi anh huong: ' + affected);

    console.log('\n=== Buoc 5: destroy ban ghi id=' + id + ' roi truy van lai ===');
    const deleted = await Book.destroy({ where: { id } });
    console.log('So dong da xoa: ' + deleted);
    const after = await Book.findByPk(id);
    console.log('Truy van lai sau khi xoa:', after === null ? 'null (da xoa thanh cong)' : after.toJSON());
  } catch (error) {
    console.error('Loi:', error.message);
    process.exitCode = 1;
  } finally {
    await sequelize.close();
  }
}

main();
