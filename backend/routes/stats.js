const express = require('express');
const router = express.Router();
const db = require('../db/init');

// GET dashboard statistics
router.get('/', (req, res) => {
  try {
    // Total counts
    const totalWorks = db.prepare('SELECT COUNT(*) as count FROM diploma_works').get().count;
    const approvedWorks = db.prepare("SELECT COUNT(*) as count FROM diploma_works WHERE status = 'approved'").get().count;
    const pendingWorks = db.prepare("SELECT COUNT(*) as count FROM diploma_works WHERE status = 'pending'").get().count;
    const totalStudents = db.prepare('SELECT COUNT(*) as count FROM students').get().count;
    const totalViews = db.prepare('SELECT SUM(views) as total FROM diploma_works').get().total || 0;

    // Works by category
    const byCategory = db.prepare(`
      SELECT category, COUNT(*) as count 
      FROM diploma_works 
      WHERE status = 'approved'
      GROUP BY category 
      ORDER BY count DESC
    `).all();

    // Works by year
    const byYear = db.prepare(`
      SELECT year, COUNT(*) as count 
      FROM diploma_works 
      WHERE status = 'approved'
      GROUP BY year 
      ORDER BY year DESC
    `).all();

    // Top viewed works
    const topViewed = db.prepare(`
      SELECT id, title, views, category 
      FROM diploma_works 
      WHERE status = 'approved'
      ORDER BY views DESC 
      LIMIT 5
    `).all();

    // Recent submissions
    const recentSubmissions = db.prepare(`
      SELECT dw.id, dw.title, dw.status, dw.created_at, s.name as student_name
      FROM diploma_works dw
      LEFT JOIN students s ON dw.student_id = s.id
      ORDER BY dw.created_at DESC
      LIMIT 10
    `).all();

    // Students by department
    const studentsByDept = db.prepare(`
      SELECT department, COUNT(*) as count 
      FROM students 
      WHERE department IS NOT NULL
      GROUP BY department 
      ORDER BY count DESC
    `).all();

    res.json({
      overview: {
        totalWorks,
        approvedWorks,
        pendingWorks,
        totalStudents,
        totalViews
      },
      byCategory,
      byYear,
      topViewed,
      recentSubmissions,
      studentsByDept
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch statistics' });
  }
});

module.exports = router;
