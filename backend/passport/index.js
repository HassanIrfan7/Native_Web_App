const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const { db } = require("../config/database");
// Google Strategy

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${process.env.BACKEND_URL}/api/auth/google/callback`,
    },
    (accessToken, refreshToken, profile, done) => {
      const googleId = profile.id;
      const email = profile.emails?.[0]?.value || null;
      const username = profile.displayName;
      const profileImage = profile.photos?.[0]?.value || null;

      db.get(
        "SELECT * FROM users WHERE google_id = ?",
        [googleId],
        (err, row) => {
          if (err) return done(err);

          if (row) {
            return done(null, row);
          } else {
            db.get(
              "SELECT * FROM users WHERE email = ?",
              [email],
              (err, existingUser) => {
                if (err) return done(err);

                if (existingUser) {
                  db.run(
                    `UPDATE users SET google_id = ?, profile_image = ? WHERE id = ?`,
                    [googleId, profileImage, existingUser.id],
                    function (err) {
                      if (err) return done(err);
                      return done(null, {
                        ...existingUser,
                        google_id: googleId,
                        profile_image: profileImage,
                      });
                    }
                  );
                } else {
                  db.run(
                    `INSERT INTO users (google_id, username, email, profile_image, role) 
                 VALUES (?, ?, ?, ?, ?)`,
                    [googleId, username, email, profileImage, "consumer"],
                    function (err) {
                      if (err) return done(err);
                      db.get(
                        "SELECT * FROM users WHERE id = ?",
                        [this.lastID],
                        (err, newUser) => {
                          return done(err, newUser);
                        }
                      );
                    }
                  );
                }
              }
            );
          }
        }
      );
    }
  )
);

// Sessions
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  db.get("SELECT * FROM users WHERE id = ?", [id], (err, row) => {
    done(err, row);
  });
});

module.exports = passport;
