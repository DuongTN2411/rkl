const express = require('express');
const controller = require('../controllers/categoryController');

const router = express.Router();

router.get('/:id', controller.getOne);

module.exports = router;
