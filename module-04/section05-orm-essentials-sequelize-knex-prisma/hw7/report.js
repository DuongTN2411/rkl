const knexLib = require('knex');
const config = require('./knexfile').development;

const knex = knexLib(config);

async function main() {
  try {
    const query = knex('users')
      .leftJoin('orders', 'users.id', 'orders.user_id')
      .select('users.name')
      .select(knex.raw('COUNT(orders.id) AS order_count'))
      .select(knex.raw('SUM(orders.total) AS total_spent'))
      .groupBy('users.id', 'users.name')
      .havingRaw('COUNT(orders.id) >= 2')
      .orderBy('total_spent', 'desc')
      .limit(3);

    console.log('SQL:');
    console.log(query.toString());

    const rows = await query;
    console.log('\nKet qua:');
    console.table(
      rows.map((row) => ({
        name: row.name,
        order_count: Number(row.order_count),
        total_spent: Number(row.total_spent),
      }))
    );
  } catch (err) {
    console.error('Loi:', err.message);
    process.exitCode = 1;
  } finally {
    await knex.destroy();
  }
}

main();
