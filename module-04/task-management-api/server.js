const app = require('./app');
const sequelize = require('./config/database');
const { PORT } = require('./config/env');

const startServer = async () => {
  try {
    await sequelize.authenticate();
    app.listen(PORT, () => {
      console.log(`Server đang chạy tại http://localhost:${PORT}/api/v1`);
    });
  } catch (error) {
    console.error('Không thể kết nối database:', error.message);
    process.exit(1);
  }
};

startServer();
