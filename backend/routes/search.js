const express = require('express');
const router = express.Router();
const db = require('../db/init');
const { calculateSimilarity } = require('../utils/similarity');

// Full-text search across diploma works
router.get('/', (req, res) => {
  try {
    const { q, category, year, limit = 20 } = req.query;

    if (!q || q.trim().length < 2) {
      return res.status(400).json({ error: 'Search query must be at least 2 characters' });
    }

    const searchTerm = `%${q.toLowerCase()}%`;

    let query = `
      SELECT dw.*, s.name as student_name
      FROM diploma_works dw
      LEFT JOIN students s ON dw.student_id = s.id
      WHERE dw.status = 'approved'
      AND (
        LOWER(dw.title) LIKE ? OR 
        LOWER(dw.description) LIKE ? OR 
        LOWER(dw.full_description) LIKE ? OR
        LOWER(dw.technologies) LIKE ?
      )
    `;
    const params = [searchTerm, searchTerm, searchTerm, searchTerm];

    if (category) {
      query += ' AND dw.category = ?';
      params.push(category);
    }
    if (year) {
      query += ' AND dw.year = ?';
      params.push(parseInt(year));
    }

    query += ' ORDER BY dw.views DESC, dw.rating DESC LIMIT ?';
    params.push(parseInt(limit));

    const works = db.prepare(query).all(...params);

    // Parse and add relevance score
    const results = works.map(w => {
      const relevance = calculateSimilarity(q, w.title + ' ' + w.description);
      return {
        ...w,
        technologies: JSON.parse(w.technologies || '[]'),
        screenshots: JSON.parse(w.screenshots || '[]'),
        relevance: Math.round(relevance * 100)
      };
    }).sort((a, b) => b.relevance - a.relevance);

    res.json({
      query: q,
      count: results.length,
      results
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Search failed' });
  }
});

// Check if diploma idea exists (for new submissions)
router.post('/check-idea', (req, res) => {
  try {
    const { title, description } = req.body;

    if (!title) {
      return res.status(400).json({ error: 'Title is required' });
    }

    const searchText = title + ' ' + (description || '');

    // Get all approved works
    const works = db.prepare(`
      SELECT id, title, description, category, year, student_id
      FROM diploma_works 
      WHERE status = 'approved'
    `).all();

    // Calculate similarity with each
    const matches = works
      .map(w => ({
        id: w.id,
        title: w.title,
        category: w.category,
        year: w.year,
        similarity: calculateSimilarity(searchText, w.title + ' ' + w.description)
      }))
      .filter(m => m.similarity >= 0.25) // 25% threshold
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, 10);

    const highMatches = matches.filter(m => m.similarity >= 0.6);
    const mediumMatches = matches.filter(m => m.similarity >= 0.4 && m.similarity < 0.6);

    res.json({
      ideaExists: highMatches.length > 0,
      warning: mediumMatches.length > 0,
      message: highMatches.length > 0 
        ? 'Similar diploma work already exists!' 
        : mediumMatches.length > 0 
          ? 'Some similar works found, review before submitting'
          : 'No similar works found, this idea appears to be unique!',
      matches: matches.map(m => ({
        ...m,
        similarity: Math.round(m.similarity * 100) + '%'
      }))
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to check idea' });
  }
});

// Get available categories
router.get('/categories', (req, res) => {
  try {
    const categories = db.prepare(`
      SELECT DISTINCT category, COUNT(*) as count 
      FROM diploma_works 
      WHERE status = 'approved'
      GROUP BY category 
      ORDER BY count DESC
    `).all();

    res.json(categories);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

// Get available years
router.get('/years', (req, res) => {
  try {
    const years = db.prepare(`
      SELECT DISTINCT year, COUNT(*) as count 
      FROM diploma_works 
      WHERE status = 'approved'
      GROUP BY year 
      ORDER BY year DESC
    `).all();

    res.json(years);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch years' });
  }
});

module.exports = router;
