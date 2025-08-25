const express = require('express');
const { db } = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Get rating for a video by current user
router.get('/video/:videoId/user', authenticateToken, async (req, res) => {
  try {
    const videoId = req.params.videoId;

    const rating = await new Promise((resolve, reject) => {
      db.get('SELECT rating FROM ratings WHERE video_id = ? AND user_id = ?', 
        [videoId, req.user.userId], (err, row) => {
          if (err) reject(err);
          else resolve(row);
        });
    });

    res.json({ rating: rating ? rating.rating : null });
  } catch (error) {
    console.error('Rating fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch rating' });
  }
});

// Add or update rating
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { videoId, rating } = req.body;

    if (!videoId || !rating) {
      return res.status(400).json({ error: 'Video ID and rating are required' });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Rating must be between 1 and 5' });
    }

    // Check if video exists
    const video = await new Promise((resolve, reject) => {
      db.get('SELECT id FROM videos WHERE id = ?', [videoId], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });

    if (!video) {
      return res.status(404).json({ error: 'Video not found' });
    }

    // Upsert rating
    await new Promise((resolve, reject) => {
      db.run(`
        INSERT OR REPLACE INTO ratings (video_id, user_id, rating)
        VALUES (?, ?, ?)
      `, [videoId, req.user.userId, rating], (err) => {
        if (err) reject(err);
        else resolve();
      });
    });

    // Get updated video stats
    const stats = await new Promise((resolve, reject) => {
      db.get(`
        SELECT AVG(rating) as average_rating, COUNT(*) as rating_count
        FROM ratings WHERE video_id = ?
      `, [videoId], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });

    res.json({
      message: 'Rating submitted successfully',
      averageRating: parseFloat(stats.average_rating).toFixed(1),
      ratingCount: stats.rating_count
    });
  } catch (error) {
    console.error('Rating submission error:', error);
    res.status(500).json({ error: 'Failed to submit rating' });
  }
});

module.exports = router;