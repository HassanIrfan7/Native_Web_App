const sqlite3 = require("sqlite3").verbose();
const path = require("path");
const fs = require("fs");

const dbPath = path.join(__dirname, "..", "database.sqlite");

// Ensure database directory exists
const dbDir = path.dirname(dbPath);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, "..", "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const db = new sqlite3.Database(dbPath);

// --- Helper Promises ---
function run(db, sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) reject(err);
      else resolve(this);
    });
  });
}
function all(db, sql, params = []) {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
}

// --- Table schemas (expected columns) ---
const tableSchemas = {
  users: {
    id: "INTEGER PRIMARY KEY AUTOINCREMENT",
    google_id: "TEXT UNIQUE",
    username: "TEXT",
    email: "TEXT UNIQUE",
    password_hash: "TEXT",
    role: "TEXT NOT NULL DEFAULT 'consumer'",
    profile_image: "TEXT",
    bio: "TEXT",
    country: "TEXT",
    city: "TEXT",
    created_at: "DATETIME DEFAULT CURRENT_TIMESTAMP",
    updated_at: "DATETIME DEFAULT CURRENT_TIMESTAMP",
  },
  videos: {
    id: "INTEGER PRIMARY KEY AUTOINCREMENT",
    title: "TEXT NOT NULL",
    description: "TEXT",
    filename: "TEXT NOT NULL",
    file_path: "TEXT NOT NULL",
    thumbnail_path: "TEXT",
    duration: "INTEGER DEFAULT 0",
    file_size: "INTEGER DEFAULT 0",
    publisher: "TEXT NOT NULL",
    producer: "TEXT NOT NULL",
    genre: "TEXT NOT NULL",
    age_rating: "TEXT NOT NULL",
    creator_id: "INTEGER NOT NULL",
    views: "INTEGER DEFAULT 0",
    created_at: "DATETIME DEFAULT CURRENT_TIMESTAMP",
    updated_at: "DATETIME DEFAULT CURRENT_TIMESTAMP",
  },
  comments: {
    id: "INTEGER PRIMARY KEY AUTOINCREMENT",
    video_id: "INTEGER NOT NULL",
    user_id: "INTEGER NOT NULL",
    content: "TEXT NOT NULL",
    created_at: "DATETIME DEFAULT CURRENT_TIMESTAMP",
  },
  ratings: {
    id: "INTEGER PRIMARY KEY AUTOINCREMENT",
    video_id: "INTEGER NOT NULL",
    user_id: "INTEGER NOT NULL",
    rating: "INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5)",
    created_at: "DATETIME DEFAULT CURRENT_TIMESTAMP",
  },
  video_likes: {
    id: "INTEGER PRIMARY KEY AUTOINCREMENT",
    video_id: "INTEGER NOT NULL",
    user_id: "INTEGER NOT NULL",
    created_at: "DATETIME DEFAULT CURRENT_TIMESTAMP",
  },
};

// --- Init DB with auto-migration ---
async function initDatabase() {
  console.log("Initializing database at:", dbPath);

  // Step 1: Create tables if not exist
  for (const [table, columns] of Object.entries(tableSchemas)) {
    const colsSql = Object.entries(columns)
      .map(([name, type]) => `${name} ${type}`)
      .join(", ");
    await run(db, `CREATE TABLE IF NOT EXISTS ${table} (${colsSql})`);
  }

  // Step 2: Auto-add missing columns
  for (const [table, columns] of Object.entries(tableSchemas)) {
    const existingCols = (await all(db, `PRAGMA table_info(${table})`)).map(
      (c) => c.name
    );
    for (const [col, type] of Object.entries(columns)) {
      if (!existingCols.includes(col)) {
        await run(db, `ALTER TABLE ${table} ADD COLUMN ${col} ${type}`);
        console.log(`✅ Added missing column '${col}' to '${table}'`);
      }
    }
  }

  // Step 3: Ensure default admin exists
  const bcrypt = require("bcryptjs");
  const defaultPassword = bcrypt.hashSync("admin123", 10);

  await run(
    db,
    `INSERT OR IGNORE INTO users (username, email, password_hash, role, country, city)
     VALUES ('admin', 'admin@example.com', ?, 'creator', 'USA', 'New York')`,
    [defaultPassword]
  );

  console.log("✅ Database initialization complete");
}

module.exports = { db, initDatabase };
