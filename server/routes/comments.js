const express = require('express');
const { db } = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Get comments for a video
router.get('/video/:videoId', async (req, res) => {
  try {
    const videoId = req.params.videoId;

    const comments = await new Promise((resolve, reject) => {
      db.all(`
        SELECT c.*, u.username, u.profile_image
        FROM comments c
        JOIN users u ON c.user_id = u.id
        WHERE c.video_id = ?
        ORDER BY c.created_at DESC
      `, [videoId], (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });

    res.json(comments);
  } catch (error) {
    console.error('Comments fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch comments' });
  }
});

// Add comment
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { videoId, content } = req.body;

    if (!videoId || !content) {
      return res.status(400).json({ error: 'Video ID and content are required' });
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

    const result = await new Promise((resolve, reject) => {
      db.run(
        'INSERT INTO comments (video_id, user_id, content) VALUES (?, ?, ?)',
        [videoId, req.user.userId, content],
        function(err) {
          if (err) reject(err);
          else resolve({ id: this.lastID });
        }
      );
    });

    // Get the created comment with user info
    const comment = await new Promise((resolve, reject) => {
      db.get(`
        SELECT c.*, u.username, u.profile_image
        FROM comments c
        JOIN users u ON c.user_id = u.id
        WHERE c.id = ?
      `, [result.id], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });

    res.status(201).json({
      message: 'Comment added successfully',
      comment
    });
  } catch (error) {
    console.error('Comment creation error:', error);
    res.status(500).json({ error: 'Failed to add comment' });
  }
});

// Delete comment
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const commentId = req.params.id;

    // Check if comment exists and belongs to the user
    const comment = await new Promise((resolve, reject) => {
      db.get('SELECT * FROM comments WHERE id = ? AND user_id = ?', 
        [commentId, req.user.userId], (err, row) => {
          if (err) reject(err);
          else resolve(row);
        });
    });

    if (!comment) {
      return res.status(404).json({ error: 'Comment not found or access denied' });
    }

    await new Promise((resolve, reject) => {
      db.run('DELETE FROM comments WHERE id = ?', [commentId], (err) => {
        if (err) reject(err);
        else resolve();
      });
    });

    res.json({ message: 'Comment deleted successfully' });
  } catch (error) {
    console.error('Comment delete error:', error);
    res.status(500).json({ error: 'Failed to delete comment' });
  }
});

module.exports = router;