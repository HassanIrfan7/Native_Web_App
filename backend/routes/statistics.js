const express = require("express");
const router = express.Router();
const { db } = require("../config/database");

// Get platform statistics
router.get("/", async (req, res) => {
  try {
    db.serialize(() => {
      const stats = {};

      // Active creators
      db.get(
        `SELECT COUNT(*) AS count FROM users WHERE role = 'creator'`,
        (err, row) => {
          if (err) return res.status(500).json({ error: err.message });
          stats.activeCreators = row.count;

          // Video views
          db.get(`SELECT SUM(views) AS totalViews FROM videos`, (err, row) => {
            if (err) return res.status(500).json({ error: err.message });
            stats.videoViews = row.totalViews || 0;

            // Comments
            db.get(
              `SELECT COUNT(*) AS totalComments FROM comments`,
              (err, row) => {
                if (err) return res.status(500).json({ error: err.message });
                stats.comments = row.totalComments;

                // Distinct countries
                db.get(
                  `SELECT COUNT(DISTINCT country) AS totalCountries FROM users WHERE country IS NOT NULL`,
                  (err, row) => {
                    if (err)
                      return res.status(500).json({ error: err.message });
                    stats.countries = row.totalCountries;

                    return res.json(stats);
                  }
                );
              }
            );
          });
        }
      );
    });
  } catch (err) {
    console.error("Error fetching stats:", err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
