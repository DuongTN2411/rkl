const express = require('express');
const controller = require('../controllers/orderController');

const router = express.Router();

router.post('/', controller.createOrder);

module.exports = router;
