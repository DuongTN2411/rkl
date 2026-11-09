const express = require('express');
const students = require('../data/students');
const { sendSuccess, sendError } = require('../utils/response');

const router = express.Router();

router.get('/', (req, res) => {
  sendSuccess(res, 200, students, { total: students.length });
});

router.get('/:id', (req, res) => {
  const student = students.find((s) => s.id === Number(req.params.id));
  if (!student) {
    return sendError(res, 404, 'STUDENT_NOT_FOUND', 'Không tìm thấy sinh viên');
  }
  sendSuccess(res, 200, student);
});

module.exports = router;
