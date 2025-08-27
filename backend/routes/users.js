const express = require('express');
const { db } = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Get current user profile
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    
    const user = await new Promise((resolve, reject) => {
      db.get('SELECT id, username, email, role, bio, profile_image, created_at FROM users WHERE id = ?', 
        [req.user.userId], (err, row) => {
          if (err) reject(err);
          else resolve(row);
        });
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

// Get all creators (for admin purposes)
router.get('/creators', authenticateToken, async (req, res) => {
  try {
    const creators = await new Promise((resolve, reject) => {
      db.all('SELECT id, username, email, bio, created_at FROM users WHERE role = ?', 
        ['creator'], (err, rows) => {
          if (err) reject(err);
          else resolve(rows);
        });
    });

    res.json(creators);
  } catch (error) {
    console.error('Creators fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch creators' });
  }
});

module.exports = router;