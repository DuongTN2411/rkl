const express = require('express');
const controller = require('../controllers/reportController');

const router = express.Router();

router.get('/slow', controller.slow);
router.get('/fast', controller.fast);

module.exports = router;
