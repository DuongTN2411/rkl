const express = require('express');
const employeeController = require('../controllers/employeeController');
const { uploadAvatar } = require('../middlewares/upload');

const router = express.Router();

router.get('/', employeeController.getEmployees);
router.post('/', employeeController.createEmployee);
router.get('/:id', employeeController.getEmployeeById);
router.post(
  '/:id/avatar',
  employeeController.ensureEmployeeExists,
  uploadAvatar,
  employeeController.uploadEmployeeAvatar
);

module.exports = router;
