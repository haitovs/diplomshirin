const express = require('express');
const router = express.Router();
const db = require('../db/init');

// Student login
router.post('/student-login', (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const student = db.prepare(`
      SELECT id, name, email, department, graduation_year, avatar, bio, skills
      FROM students WHERE email = ? AND password = ?
    `).get(email.toLowerCase().trim(), password);

    if (!student) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    res.json({
      id: student.id,
      name: student.name,
      email: student.email,
      department: student.department,
      graduation_year: student.graduation_year,
      avatar: student.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${student.name}`,
      role: 'student',
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Login failed' });
  }
});

module.exports = router;
