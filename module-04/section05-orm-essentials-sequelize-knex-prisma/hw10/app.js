const express = require('express');
const queryMeter = require('./middleware/queryMeter');
const reportRoutes = require('./routes/reportRoutes');

const app = express();

app.use(express.json());
app.use(queryMeter);
app.use('/api/v1/report', reportRoutes);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: { code: 'NOT_FOUND', message: 'Khong tim thay duong dan' },
  });
});

app.use((err, req, res, next) => {
  console.error(err.message);
  res.status(500).json({
    success: false,
    error: { code: 'INTERNAL_ERROR', message: 'Da xay ra loi may chu' },
  });
});

module.exports = app;
