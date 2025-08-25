const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { db } = require('../config/database');
const { authenticateToken, requireCreator } = require('../middleware/auth');

const router = express.Router();

// Configure multer for video uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '..', 'uploads');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /mp4|avi|mov|wmv|flv|webm|mkv/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only video files are allowed'));
    }
  }
});

// Get all videos (public)
router.get('/', async (req, res) => {
  try {
    const { genre, ageRating, publisher, search, page = 1, limit = 12 } = req.query;
    const offset = (page - 1) * limit;

    let query = `
      SELECT v.*, u.username as creator_name,
             COALESCE(AVG(r.rating), 0) as average_rating,
             COUNT(DISTINCT r.id) as rating_count,
             COUNT(DISTINCT c.id) as comment_count
      FROM videos v
      LEFT JOIN users u ON v.creator_id = u.id
      LEFT JOIN ratings r ON v.id = r.video_id
      LEFT JOIN comments c ON v.id = c.video_id
    `;

    const conditions = [];
    const params = [];

    if (genre && genre !== 'all') {
      conditions.push('v.genre = ?');
      params.push(genre);
    }

    if (ageRating && ageRating !== 'all') {
      conditions.push('v.age_rating = ?');
      params.push(ageRating);
    }

    if (publisher && publisher !== 'all') {
      conditions.push('v.publisher = ?');
      params.push(publisher);
    }

    if (search) {
      conditions.push('(v.title LIKE ? OR v.description LIKE ? OR v.publisher LIKE ?)');
      const searchTerm = `%${search}%`;
      params.push(searchTerm, searchTerm, searchTerm);
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    query += ' GROUP BY v.id ORDER BY v.created_at DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), offset);

    const videos = await new Promise((resolve, reject) => {
      db.all(query, params, (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });

    // Get total count for pagination
    let countQuery = 'SELECT COUNT(*) as total FROM videos v';
    const countParams = [];

    if (conditions.length > 0) {
      countQuery += ' WHERE ' + conditions.join(' AND ');
      countParams.push(...params.slice(0, params.length - 2));
    }

    const totalCount = await new Promise((resolve, reject) => {
      db.get(countQuery, countParams, (err, row) => {
        if (err) reject(err);
        else resolve(row.total);
      });
    });

    res.json({
      videos: videos.map(video => ({
        ...video,
        average_rating: parseFloat(video.average_rating).toFixed(1),
        rating_count: parseInt(video.rating_count),
        comment_count: parseInt(video.comment_count)
      })),
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalCount / limit),
        totalItems: totalCount,
        hasNext: offset + videos.length < totalCount,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('Videos fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch videos' });
  }
});

// Get single video
router.get('/:id', async (req, res) => {
  try {
    const videoId = req.params.id;

    // Increment view count
    await new Promise((resolve, reject) => {
      db.run('UPDATE videos SET views = views + 1 WHERE id = ?', [videoId], (err) => {
        if (err) reject(err);
        else resolve();
      });
    });

    const video = await new Promise((resolve, reject) => {
      db.get(`
        SELECT v.*, u.username as creator_name,
               COALESCE(AVG(r.rating), 0) as average_rating,
               COUNT(DISTINCT r.id) as rating_count,
               COUNT(DISTINCT c.id) as comment_count
        FROM videos v
        LEFT JOIN users u ON v.creator_id = u.id
        LEFT JOIN ratings r ON v.id = r.video_id
        LEFT JOIN comments c ON v.id = c.video_id
        WHERE v.id = ?
        GROUP BY v.id
      `, [videoId], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });

    if (!video) {
      return res.status(404).json({ error: 'Video not found' });
    }

    res.json({
      ...video,
      average_rating: parseFloat(video.average_rating).toFixed(1),
      rating_count: parseInt(video.rating_count),
      comment_count: parseInt(video.comment_count)
    });
  } catch (error) {
    console.error('Video fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch video' });
  }
});

// Upload video (creators only)
router.post('/', authenticateToken, requireCreator, upload.single('video'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Video file is required' });
    }

    const { title, description, publisher, producer, genre, ageRating } = req.body;

    if (!title || !publisher || !producer || !genre || !ageRating) {
      return res.status(400).json({ 
        error: 'Title, publisher, producer, genre, and age rating are required' 
      });
    }

    const result = await new Promise((resolve, reject) => {
      db.run(`
        INSERT INTO videos (title, description, filename, file_path, publisher, producer, genre, age_rating, creator_id, file_size)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        title,
        description || '',
        req.file.filename,
        req.file.path,
        publisher,
        producer,
        genre,
        ageRating,
        req.user.userId,
        req.file.size
      ], function(err) {
        if (err) reject(err);
        else resolve({ id: this.lastID });
      });
    });

    res.status(201).json({
      message: 'Video uploaded successfully',
      video: {
        id: result.id,
        title,
        description,
        filename: req.file.filename,
        publisher,
        producer,
        genre,
        age_rating: ageRating,
        file_size: req.file.size
      }
    });
  } catch (error) {
    console.error('Video upload error:', error);
    res.status(500).json({ error: 'Failed to upload video' });
  }
});

// Update video (creators only)
router.put('/:id', authenticateToken, requireCreator, async (req, res) => {
  try {
    const videoId = req.params.id;
    const { title, description, publisher, producer, genre, ageRating } = req.body;

    // Check if video exists and belongs to the creator
    const video = await new Promise((resolve, reject) => {
      db.get('SELECT * FROM videos WHERE id = ? AND creator_id = ?', 
        [videoId, req.user.userId], (err, row) => {
          if (err) reject(err);
          else resolve(row);
        });
    });

    if (!video) {
      return res.status(404).json({ error: 'Video not found or access denied' });
    }

    await new Promise((resolve, reject) => {
      db.run(`
        UPDATE videos 
        SET title = ?, description = ?, publisher = ?, producer = ?, genre = ?, age_rating = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `, [
        title || video.title,
        description !== undefined ? description : video.description,
        publisher || video.publisher,
        producer || video.producer,
        genre || video.genre,
        ageRating || video.age_rating,
        videoId
      ], (err) => {
        if (err) reject(err);
        else resolve();
      });
    });

    res.json({ message: 'Video updated successfully' });
  } catch (error) {
    console.error('Video update error:', error);
    res.status(500).json({ error: 'Failed to update video' });
  }
});

// Delete video (creators only)
router.delete('/:id', authenticateToken, requireCreator, async (req, res) => {
  try {
    const videoId = req.params.id;

    // Check if video exists and belongs to the creator
    const video = await new Promise((resolve, reject) => {
      db.get('SELECT * FROM videos WHERE id = ? AND creator_id = ?', 
        [videoId, req.user.userId], (err, row) => {
          if (err) reject(err);
          else resolve(row);
        });
    });

    if (!video) {
      return res.status(404).json({ error: 'Video not found or access denied' });
    }

    // Delete the file
    if (video.file_path && fs.existsSync(video.file_path)) {
      fs.unlinkSync(video.file_path);
    }

    // Delete from database
    await new Promise((resolve, reject) => {
      db.run('DELETE FROM videos WHERE id = ?', [videoId], (err) => {
        if (err) reject(err);
        else resolve();
      });
    });

    res.json({ message: 'Video deleted successfully' });
  } catch (error) {
    console.error('Video delete error:', error);
    res.status(500).json({ error: 'Failed to delete video' });
  }
});

// Get videos by creator (for admin panel)
router.get('/creator/my-videos', authenticateToken, requireCreator, async (req, res) => {
  try {
    const videos = await new Promise((resolve, reject) => {
      db.all(`
        SELECT v.*, 
               COALESCE(AVG(r.rating), 0) as average_rating,
               COUNT(DISTINCT r.id) as rating_count,
               COUNT(DISTINCT c.id) as comment_count
        FROM videos v
        LEFT JOIN ratings r ON v.id = r.video_id
        LEFT JOIN comments c ON v.id = c.video_id
        WHERE v.creator_id = ?
        GROUP BY v.id
        ORDER BY v.created_at DESC
      `, [req.user.userId], (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });

    res.json(videos.map(video => ({
      ...video,
      average_rating: parseFloat(video.average_rating).toFixed(1),
      rating_count: parseInt(video.rating_count),
      comment_count: parseInt(video.comment_count)
    })));
  } catch (error) {
    console.error('Creator videos fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch videos' });
  }
});

// Toggle like for video
router.post('/:id/like', authenticateToken, async (req, res) => {
  try {
    const videoId = req.params.id;
    const userId = req.user.userId;

    // Check if user already liked this video
    const existingLike = await new Promise((resolve, reject) => {
      db.get('SELECT * FROM video_likes WHERE video_id = ? AND user_id = ?', 
        [videoId, userId], (err, row) => {
          if (err) reject(err);
          else resolve(row);
        });
    });

    let liked = false;
    if (existingLike) {
      // Remove like
      await new Promise((resolve, reject) => {
        db.run('DELETE FROM video_likes WHERE video_id = ? AND user_id = ?', 
          [videoId, userId], (err) => {
            if (err) reject(err);
            else resolve();
          });
      });
    } else {
      // Add like
      await new Promise((resolve, reject) => {
        db.run('INSERT INTO video_likes (video_id, user_id) VALUES (?, ?)', 
          [videoId, userId], (err) => {
            if (err) reject(err);
            else resolve();
          });
      });
      liked = true;
    }

    // Get total likes count
    const totalLikes = await new Promise((resolve, reject) => {
      db.get('SELECT COUNT(*) as count FROM video_likes WHERE video_id = ?', 
        [videoId], (err, row) => {
          if (err) reject(err);
          else resolve(row.count);
        });
    });

    res.json({ liked, totalLikes });
  } catch (error) {
    console.error('Like toggle error:', error);
    res.status(500).json({ error: 'Failed to toggle like' });
  }
});

// Get like status for video
router.get('/:id/like-status', authenticateToken, async (req, res) => {
  try {
    const videoId = req.params.id;
    const userId = req.user.userId;

    const like = await new Promise((resolve, reject) => {
      db.get('SELECT * FROM video_likes WHERE video_id = ? AND user_id = ?', 
        [videoId, userId], (err, row) => {
          if (err) reject(err);
          else resolve(row);
        });
    });

    res.json({ liked: !!like });
  } catch (error) {
    console.error('Like status error:', error);
    res.status(500).json({ error: 'Failed to get like status' });
  }
});

module.exports = router;