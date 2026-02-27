const express = require('express');
const router = express.Router();
const db = require('../db/init');
const { v4: uuidv4 } = require('uuid');
const { calculateSimilarity, createSearchHash } = require('../utils/similarity');

// GET all diploma works (with filters)
router.get('/', (req, res) => {
  try {
    const { category, year, status, student_id, featured, limit = 50, offset = 0 } = req.query;
    
    let query = `
      SELECT dw.*, s.name as student_name, s.avatar as student_avatar
      FROM diploma_works dw
      LEFT JOIN students s ON dw.student_id = s.id
      WHERE 1=1
    `;
    const params = [];

    if (category) {
      query += ' AND dw.category = ?';
      params.push(category);
    }
    if (year) {
      query += ' AND dw.year = ?';
      params.push(parseInt(year));
    }
    if (status) {
      query += ' AND dw.status = ?';
      params.push(status);
    } else {
      // Default: only approved works for public
      query += ' AND dw.status = ?';
      params.push('approved');
    }
    if (student_id) {
      query += ' AND dw.student_id = ?';
      params.push(parseInt(student_id));
    }
    if (featured === 'true') {
      query += ' AND dw.featured = 1';
    }

    query += ' ORDER BY dw.created_at DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), parseInt(offset));

    const works = db.prepare(query).all(...params);
    
    // Parse JSON fields
    const parsed = works.map(w => ({
      ...w,
      technologies: JSON.parse(w.technologies || '[]'),
      screenshots: JSON.parse(w.screenshots || '[]')
    }));

    res.json(parsed);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch diploma works' });
  }
});

// GET single diploma work
router.get('/:id', (req, res) => {
  try {
    const { id } = req.params;
    
    const work = db.prepare(`
      SELECT dw.*, s.name as student_name, s.email as student_email, 
             s.avatar as student_avatar, s.department as student_department
      FROM diploma_works dw
      LEFT JOIN students s ON dw.student_id = s.id
      WHERE dw.id = ?
    `).get(parseInt(id));

    if (!work) {
      return res.status(404).json({ error: 'Diploma work not found' });
    }

    // Increment views
    db.prepare('UPDATE diploma_works SET views = views + 1 WHERE id = ?').run(parseInt(id));

    // Parse JSON fields
    work.technologies = JSON.parse(work.technologies || '[]');
    work.screenshots = JSON.parse(work.screenshots || '[]');

    res.json(work);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch diploma work' });
  }
});

// POST create new diploma work
router.post('/', (req, res) => {
  try {
    const {
      title, description, full_description, student_id, category, year,
      technologies, screenshots, demo_url, github_url, documentation_url,
      supervisor, abstract: abstractText, methodology, key_findings, defense_date
    } = req.body;

    if (!title || !description || !student_id || !category || !year) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Create slug
    const slug = title.toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '') + '-' + Date.now().toString(36);

    // Create similarity hash
    const similarity_hash = createSearchHash(title + ' ' + description);

    const result = db.prepare(`
      INSERT INTO diploma_works
      (title, slug, description, full_description, student_id, category, year,
       technologies, screenshots, demo_url, github_url, documentation_url,
       supervisor, abstract, methodology, key_findings, defense_date,
       similarity_hash, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending')
    `).run(
      title, slug, description, full_description || '', parseInt(student_id),
      category, parseInt(year),
      JSON.stringify(technologies || []),
      JSON.stringify(screenshots || []),
      demo_url || null, github_url || null, documentation_url || null,
      supervisor || null, abstractText || null, methodology || null,
      key_findings || null, defense_date || null,
      similarity_hash
    );

    res.status(201).json({ 
      id: result.lastInsertRowid, 
      slug,
      message: 'Diploma work submitted for approval' 
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create diploma work' });
  }
});

// PUT update diploma work
router.put('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Build dynamic update query
    const fields = [];
    const params = [];

    const allowedFields = [
      'title', 'description', 'full_description', 'category', 'year',
      'technologies', 'screenshots', 'demo_url', 'github_url',
      'documentation_url', 'supervisor', 'abstract', 'methodology',
      'key_findings', 'defense_date', 'status', 'featured'
    ];

    for (const field of allowedFields) {
      if (updates[field] !== undefined) {
        fields.push(`${field} = ?`);
        if (field === 'technologies' || field === 'screenshots') {
          params.push(JSON.stringify(updates[field]));
        } else {
          params.push(updates[field]);
        }
      }
    }

    if (fields.length === 0) {
      return res.status(400).json({ error: 'No valid fields to update' });
    }

    fields.push('updated_at = CURRENT_TIMESTAMP');
    params.push(parseInt(id));

    db.prepare(`UPDATE diploma_works SET ${fields.join(', ')} WHERE id = ?`).run(...params);

    res.json({ message: 'Diploma work updated' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update diploma work' });
  }
});

// DELETE diploma work
router.delete('/:id', (req, res) => {
  try {
    const { id } = req.params;
    db.prepare('DELETE FROM diploma_works WHERE id = ?').run(parseInt(id));
    res.json({ message: 'Diploma work deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete diploma work' });
  }
});

// POST check similarity before submit
router.post('/check-similarity', (req, res) => {
  try {
    const { title, description } = req.body;

    if (!title && !description) {
      return res.status(400).json({ error: 'Title or description required' });
    }

    const searchText = (title || '') + ' ' + (description || '');
    
    // Get all existing works
    const works = db.prepare(`
      SELECT id, title, description, student_id FROM diploma_works WHERE status = 'approved'
    `).all();

    // Calculate similarity for each
    const matches = works
      .map(w => ({
        id: w.id,
        title: w.title,
        similarity: calculateSimilarity(searchText, w.title + ' ' + w.description)
      }))
      .filter(m => m.similarity >= 0.3) // 30% threshold
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, 5);

    res.json({
      hasMatches: matches.length > 0,
      matches: matches.map(m => ({
        ...m,
        similarity: Math.round(m.similarity * 100) + '%'
      }))
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to check similarity' });
  }
});

module.exports = router;
