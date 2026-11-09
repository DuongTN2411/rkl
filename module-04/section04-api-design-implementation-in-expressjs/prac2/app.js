const express = require('express');
const studentRoutes = require('./routes/students');
const { sendError } = require('./utils/response');

const app = express();
app.use(express.json());

app.use('/api/v1/students', studentRoutes);

app.use((req, res) => {
  sendError(res, 404, 'ROUTE_NOT_FOUND', 'Không tìm thấy đường dẫn');
});

const PORT = process.env.PORT || 3000;
if (require.main === module) {
  app.listen(PORT, () => console.log(`Server chạy tại http://localhost:${PORT}`));
}

module.exports = app;
