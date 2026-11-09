'use strict';

module.exports = {
  async up(queryInterface) {
    const now = new Date();

    await queryInterface.bulkInsert('categories', [
      { id: 1, name: 'Sach', created_at: now, updated_at: now },
      { id: 2, name: 'Van phong pham', created_at: now, updated_at: now },
      { id: 3, name: 'Do dien tu', created_at: now, updated_at: now },
    ]);

    await queryInterface.bulkInsert('products', [
      { name: 'Sach Node.js', price: 120000, category_id: 1, created_at: now, updated_at: now },
      { name: 'Sach MySQL', price: 95000, category_id: 1, created_at: now, updated_at: now },
      { name: 'But bi', price: 5000, category_id: 2, created_at: now, updated_at: now },
      { name: 'So tay', price: 30000, category_id: 2, created_at: now, updated_at: now },
      { name: 'Chuot khong day', price: 250000, category_id: 3, created_at: now, updated_at: now },
      { name: 'Ban phim co', price: 890000, category_id: 3, created_at: now, updated_at: now },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('products', null, {});
    await queryInterface.bulkDelete('categories', null, {});
  },
};
