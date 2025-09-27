const express = require('express');
const router = express.Router();
const db = require('../config/db');

// GET all students
router.get('/', (req, res) => {
  db.query('SELECT * FROM students', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// GET single student
router.get('/:id', (req, res) => {
  const { id } = req.params;
  db.query('SELECT * FROM students WHERE id = ?', [id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(404).json({ message: 'Student not found' });
    res.json(results[0]);
  });
});


router.post('/', (req, res) => {
  const { name, email, course, year_level } = req.body;

  
  if (!name || !email) {
    return res.status(400).json({ error: 'Name and email are required' });
  }

  
  db.query('SELECT * FROM students WHERE email = ?', [email], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length > 0) {
      return res.status(409).json({ error: 'Email already exists' });
    }

    
    db.query(
      'INSERT INTO students (name, email, course, year_level) VALUES (?, ?, ?, ?)',
      [name, email, course, year_level],
      (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ id: results.insertId, name, email, course, year_level });
      }
    );
  });
});

// PUT update student
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { name, email, course, year_level } = req.body;

  db.query(
    'UPDATE students SET name = ?, email = ?, course = ?, year_level = ? WHERE id = ?',
    [name, email, course, year_level, id],
    (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      if (results.affectedRows === 0) return res.status(404).json({ message: 'Student not found' });
      res.json({ message: 'Student updated successfully' });
    }
  );
});

// GET one student by ID
router.get('/:id', (req, res) => {
  const { id } = req.params;

  db.query('SELECT * FROM students WHERE id = ?', [id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });

    if (results.length === 0) {
      return res.status(404).json({ error: 'Student not found' }); 
    }

    res.json(results[0]); 
  });
});


// DELETE student
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM students WHERE id = ?', [id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.affectedRows === 0) return res.status(404).json({ message: 'Student not found' });
    res.json({ message: 'Student deleted successfully' });
  });
});

module.exports = router;
