const orders = [
  { id: 1, userId: 1, status: 'paid', total: 120000 },
  { id: 2, userId: 1, status: 'pending', total: 80000 },
  { id: 3, userId: 1, status: 'cancelled', total: 50000 },
  { id: 4, userId: 2, status: 'paid', total: 200000 },
  { id: 5, userId: 2, status: 'paid', total: 150000 },
  { id: 6, userId: 2, status: 'pending', total: 90000 },
  { id: 7, userId: 2, status: 'paid', total: 300000 },
  { id: 8, userId: 3, status: 'paid', total: 70000 },
  { id: 9, userId: 3, status: 'cancelled', total: 60000 },
  { id: 10, userId: 3, status: 'pending', total: 110000 },
];

module.exports = orders;
