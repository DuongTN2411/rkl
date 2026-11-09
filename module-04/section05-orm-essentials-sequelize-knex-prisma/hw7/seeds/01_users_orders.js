exports.seed = async function (knex) {
  await knex('orders').del();
  await knex('users').del();

  await knex('users').insert([
    { name: 'Nguyen Van An', email: 'an@example.com' },
    { name: 'Tran Thi Binh', email: 'binh@example.com' },
    { name: 'Le Van Cuong', email: 'cuong@example.com' },
    { name: 'Pham Thi Dung', email: 'dung@example.com' },
    { name: 'Hoang Van Em', email: 'em@example.com' },
  ]);

  const users = await knex('users').select('id').orderBy('id');
  const totalsByUser = [
    [450000, 320000, 150000, 80000],
    [700000, 250000, 90000],
    [120000, 130000, 60000],
    [500000, 400000, 300000],
    [200000, 180000],
  ];

  const orders = [];
  totalsByUser.forEach((totals, index) => {
    totals.forEach((total) => orders.push({ user_id: users[index].id, total }));
  });

  await knex('orders').insert(orders);
};
