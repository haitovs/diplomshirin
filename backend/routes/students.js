const express = require('express');
const router = express.Router();
const db = require('../db/init');

// GET all students
router.get('/', (req, res) => {
  try {
    const { department, year, limit = 50, offset = 0 } = req.query;
    
    let query = 'SELECT * FROM students WHERE 1=1';
    const params = [];

    if (department) {
      query += ' AND department = ?';
      params.push(department);
    }
    if (year) {
      query += ' AND graduation_year = ?';
      params.push(parseInt(year));
    }

    query += ' ORDER BY name ASC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), parseInt(offset));

    const students = db.prepare(query).all(...params);
    
    // Parse JSON fields
    const parsed = students.map(s => ({
      ...s,
      skills: JSON.parse(s.skills || '[]')
    }));

    res.json(parsed);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch students' });
  }
});

// GET single student with their works
router.get('/:id', (req, res) => {
  try {
    const { id } = req.params;
    
    const student = db.prepare('SELECT * FROM students WHERE id = ?').get(parseInt(id));

    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    // Get student's diploma works
    const works = db.prepare(`
      SELECT * FROM diploma_works WHERE student_id = ? AND status = 'approved'
      ORDER BY created_at DESC
    `).all(parseInt(id));

    student.skills = JSON.parse(student.skills || '[]');
    student.diploma_works = works.map(w => ({
      ...w,
      technologies: JSON.parse(w.technologies || '[]'),
      screenshots: JSON.parse(w.screenshots || '[]')
    }));

    res.json(student);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch student' });
  }
});

// POST create new student
router.post('/', (req, res) => {
  try {
    const { name, email, department, graduation_year, avatar, bio, skills, linkedin, github, portfolio } = req.body;

    if (!name || !email) {
      return res.status(400).json({ error: 'Name and email are required' });
    }

    // Check if email exists
    const exists = db.prepare('SELECT id FROM students WHERE email = ?').get(email);
    if (exists) {
      return res.status(409).json({ error: 'Email already registered' });
    }

    const result = db.prepare(`
      INSERT INTO students (name, email, department, graduation_year, avatar, bio, skills, linkedin, github, portfolio)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      name, email, department || null, graduation_year || null,
      avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${name.replace(/\s/g, '')}`,
      bio || null, JSON.stringify(skills || []),
      linkedin || null, github || null, portfolio || null
    );

    res.status(201).json({ id: result.lastInsertRowid, message: 'Student created' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create student' });
  }
});

// PUT update student
router.put('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const fields = [];
    const params = [];

    const allowedFields = ['name', 'email', 'department', 'graduation_year', 'avatar', 'bio', 'skills', 'linkedin', 'github', 'portfolio'];

    for (const field of allowedFields) {
      if (updates[field] !== undefined) {
        fields.push(`${field} = ?`);
        if (field === 'skills') {
          params.push(JSON.stringify(updates[field]));
        } else {
          params.push(updates[field]);
        }
      }
    }

    if (fields.length === 0) {
      return res.status(400).json({ error: 'No valid fields to update' });
    }

    params.push(parseInt(id));
    db.prepare(`UPDATE students SET ${fields.join(', ')} WHERE id = ?`).run(...params);

    res.json({ message: 'Student updated' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update student' });
  }
});

// DELETE student
router.delete('/:id', (req, res) => {
  try {
    const { id } = req.params;
    db.prepare('DELETE FROM students WHERE id = ?').run(parseInt(id));
    res.json({ message: 'Student deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete student' });
  }
});

module.exports = router;
