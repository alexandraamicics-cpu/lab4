const express = require('express');
const router = express.Router();
const db = require('../config/db'); 

// CREATE 
router.post('/', (req, res) => {
  const { code, title, units } = req.body;

  if (!code || !title || !units) {
    return res.status(400).json({ error: "All fields (code, title, units) are required." });
  }

  db.query(
    'INSERT INTO courses (code, title, units) VALUES (?, ?, ?)',
    [code, title, units],
    (err, result) => {
      if (err) {
        if (err.code === 'ER_DUP_ENTRY') {
          return res.status(409).json({ error: "Course code already exists." });
        }
        return res.status(500).json({ error: err.message });
      }
      res.status(201).json({ id: result.insertId, code, title, units });
    }
  );
});

// READ ALL course

router.get('/', (req, res) => {
  db.query('SELECT * FROM courses', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// READ ONE course 
router.get('/:id', (req, res) => {
  const { id } = req.params;
  db.query('SELECT * FROM courses WHERE id = ?', [id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) {
      return res.status(404).json({ error: "Course not found." });
    }
    res.json(results[0]);
  });
});

// UPDATE a course
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { code, title, units } = req.body;

  db.query(
    'UPDATE courses SET code = ?, title = ?, units = ? WHERE id = ?',
    [code, title, units, id],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "Course not found." });
      }
      res.json({ id, code, title, units });
    }
  );
});

// DELETE a course
router.delete('/:id', (req, res) => {
  const { id } = req.params;

  db.query('DELETE FROM courses WHERE id = ?', [id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Course not found." });
    }
    res.json({ message: "Course deleted successfully." });
  });
});

module.exports = router;
