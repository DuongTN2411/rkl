const express = require('express');
const statisticController = require('../controllers/statisticController');
const authenticate = require('../middlewares/authenticate');

const router = express.Router();

router.get('/me', authenticate, statisticController.me);

module.exports = router;
