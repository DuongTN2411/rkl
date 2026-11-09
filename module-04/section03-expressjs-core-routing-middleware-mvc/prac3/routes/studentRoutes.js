const express = require('express');

const router = express.Router();

let students = [
  { id: 1, name: 'Nguyễn Văn A', score: 8.5 },
  { id: 2, name: 'Trần Thị B', score: 9 }
];
let nextId = 3;

router.get('/', (req, res) => {
  res.json(students);
});

router.post('/', (req, res) => {
  const { name, score } = req.body;

  if (!name) {
    return res.status(400).json({ message: 'Thiếu trường name' });
  }

  const student = { id: nextId++, name, score };
  students.push(student);
  res.status(201).json(student);
});

router.get('/:id', (req, res) => {
  const student = students.find((s) => s.id === Number(req.params.id));

  if (!student) {
    return res.status(404).json({ message: 'Không tìm thấy sinh viên' });
  }

  res.json(student);
});

router.delete('/:id', (req, res) => {
  const index = students.findIndex((s) => s.id === Number(req.params.id));

  if (index === -1) {
    return res.status(404).json({ message: 'Không tìm thấy sinh viên' });
  }

  const [removed] = students.splice(index, 1);
  res.status(200).json(removed);
});

module.exports = router;
