const express = require('express');

const app = express();
const PORT = 3000;

app.get('/products/:id', (req, res) => {
  const productId = req.params.id;
  const sort = req.query.sort || 'desc';
  const limit = req.query.limit || '20';

  res.json({ productId, sort, limit });
});

app.listen(PORT, () => {
  console.log(`Server chạy tại http://localhost:${PORT}`);
});
