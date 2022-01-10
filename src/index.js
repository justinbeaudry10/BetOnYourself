const express = require("express");
const newConnection = require("./DBConnection");
const path = require("path");
const cookieParser = require("cookie-parser");
const session = require("express-session");
//const router = express.Router();
const app = express();

// Serving static files, with default page as login.html
app.use(express.static("static", { index: "login.html" }));

app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true,
  })
);

app.use(cookieParser());

// Needed for POST method with forms
app.use(
  express.urlencoded({
    extended: true,
  })
);

// Needed for POST method with JSON objects
app.use(express.json());

// Gets the register page
app.get("/register", (req, res) => {
  res.sendFile(path.join(__dirname, "static/register.html"));
});

app.post("/login", (req, res) => {
  let conn = newConnection();
  conn.connect();

  conn.query(
    `SELECT * FROM users WHERE email="${req.body.email}"`,
    (err, rows, fields) => {
      if (err) res.send(err);
      else {
        let resObj = {
          correct: false,
        };

        for (r of rows) {
          if (r.userPassword === req.body.password) {
            req.session.loggedin = true;
            req.session.email = req.body.email;
            resObj.correct = true;
          }
        }
        res.json(resObj);
      }
      conn.end();
    }
  );
});

app.get("/accountInfo", (req, res) => {
  let conn = newConnection();
  conn.connect();

  let fullName;
  let bets = [];
  let legs = [];

  conn.query(
    `SELECT fName, lName FROM users WHERE email="${req.session.email}"`,
    (err, rows, fields) => {
      if (err) console.log(err);
      else {
        for (r of rows) {
          fullName = r.fName + " " + r.lName;
        }
      }
    }
  );

  conn.query(
    `SELECT * FROM bets WHERE bettor="${req.session.email}"`,
    (err, rows, fields) => {
      if (err) console.log(err);
      else {
        for (r of rows) {
          bets.push(r);
        }
      }
    }
  );

  conn.query(
    `SELECT * FROM legs WHERE betNo IN (SELECT betNo FROM bets WHERE bettor="${req.session.email}")`,
    (err, rows, fields) => {
      if (err) console.log(err);
      else {
        for (r of rows) {
          legs.push(r);
        }

        res.json({
          fullName: fullName,
          bets: bets,
          legs: legs,
        });
      }
    }
  );
  conn.end();
});

// Inserts a new tuple into users table upon signup
app.post("/signup", (req, res) => {
  let conn = newConnection();
  conn.connect();

  conn.query(
    `INSERT INTO users VALUES ("${req.body["email"]}", "${req.body["password"]}", "${req.body["firstName"]}", "${req.body["lastName"]}")`,
    (err, rows, fields) => {
      if (err) res.json({ success: false });
      else {
        res.json({ success: true });
        conn.end();
      }
    }
  );
});

app.post("/addBet", (req, res) => {
  let conn = newConnection();
  conn.connect();

  conn.query(
    `INSERT INTO bets VALUES (null, "${req.body.sportsbook}", ${req.body.stake}, ${req.body.odds}, "${req.body.date}", "${req.body.result}", ${req.body.returnAmt},"${req.session.email}")`,
    (err, rows, fields) => {
      if (err) console.log(err);
      else res.json({ result: "Bet added successfully!" });
    }
  );

  conn.query(
    `INSERT INTO legs VALUES(null, "${req.body.league}", "${req.body.event}", "${req.body.selection}", (SELECT MAX(betNo) FROM bets))`
  );
});

app.listen(3000);
