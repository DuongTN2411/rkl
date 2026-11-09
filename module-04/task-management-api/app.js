const express = require('express');
const routes = require('./routes');
const { notFound, errorHandler } = require('./middlewares/errorHandler');
const { UPLOAD_DIR } = require('./config/upload');

const app = express();

app.disable('x-powered-by');
app.use(express.json({ limit: '1mb' }));
app.use('/api/v1/uploads', express.static(UPLOAD_DIR));
app.use('/api/v1', routes);
app.use(notFound);
app.use(errorHandler);

module.exports = app;
