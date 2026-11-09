const sequelize = require('./config/database');
const app = require('./app');

const port = process.env.PORT || 3000;

sequelize
  .authenticate()
  .then(() => {
    app.listen(port, () => console.log('Server dang chay tai http://localhost:' + port));
  })
  .catch((err) => {
    console.error('Khong the ket noi database:', err.message);
    process.exit(1);
  });
