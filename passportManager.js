const LocalStrategy = require("passport-local").Strategy;
const { pool } = require("./dbManager");
const bcrypt = require("bcrypt");

function initialize(passport) {
  console.log("Initialized");

  const authenticateUser = (email, password, done) => {
    // console.log(email, password);
    pool.query(
      `SELECT * FROM users WHERE email = $1`,
      [email],
      (err, results) => {
        if (err) {
          throw err;
        }
        console.log(results.rows);
        console.log("Testing...");

        if (results.rows.length > 0) {
            console.log("Hey hello");
          const user = results.rows[0];

          bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) {
              console.log(err);
            }
            if (isMatch) {
                console.log("lol");
              return done(null, user);
              console.log("Success!");
            } else {
                console.log("lol no");
              //password is incorrect
              return done(null, false, { message: "Password is incorrect" });
              console.log("Error!")
            }
          });
        } else {
          // No user
          console.log("No user exists...");
          return done(null, false, {
            message: "No user with that email address"
          });
        }
      }
    );
  };

  passport.use(
    new LocalStrategy(
      { usernameField: "email", passwordField: "password" },
      authenticateUser
    )
  );

  
  passport.serializeUser((user, done) => done(null, user.id));

  passport.deserializeUser((id, done) => {
    pool.query(`SELECT * FROM users WHERE id = $1`, [id], (err, results) => {
      if (err) {
        return done(err);
      }
      console.log(`ID is ${results.rows[0].id}`);
      return done(null, results.rows[0]);
    });
  });
}

module.exports = initialize;