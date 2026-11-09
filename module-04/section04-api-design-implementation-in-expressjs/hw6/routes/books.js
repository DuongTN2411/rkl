const express = require('express');
const books = require('../data/books');
const { sendSuccess } = require('../utils/response');

const router = express.Router();

const formatters = {
  v1: (b) => ({ id: b.id, title: b.title, author: b.author.name }),
  v2: (b) => ({
    id: b.id,
    title: b.title,
    author: { id: b.author.id, name: b.author.name },
    publishedYear: b.publishedYear,
  }),
};

router.get('/', (req, res) => {
  const format = formatters[req.apiVersion];
  sendSuccess(res, 200, books.map(format), { total: books.length });
});

module.exports = router;
