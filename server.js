const express = require("express");
const newConnection = require("./DBConnection");
const path = require("path");
const session = require("express-session");
//const router = express.Router();
const app = express();
const expressLayouts = require("express-ejs-layouts");

const indexRouter = require("./routes/index");

app.set("view engine", "ejs");
app.set("views", __dirname + "/views");
app.set("layout", "layouts/layout");
app.use(expressLayouts);
app.use(express.static("static"));

app.use("/", indexRouter);

app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true,
  })
);

// Needed for POST method with forms
app.use(
  express.urlencoded({
    extended: true,
  })
);

// Needed for POST method with JSON objects
app.use(express.json());

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
            res.send(resObj);
          } else {
            res.send(resObj);
          }
        }
      }
      conn.end();
    }
  );
});

app.get("/dashboard", (req, res) => {
  res.render("dashboard");
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
        res.redirect("/");
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

app.post("/deleteBet", (req, res) => {
  let conn = newConnection();
  conn.connect();

  conn.query(
    `DELETE FROM bets WHERE betNo=${req.body.betNo}`,
    (err, rows, fields) => {
      if (err) console.log(err);
      else res.json({ result: "Bet deleted successfully!" });
    }
  );
});

app.listen(process.env.PORT || 3000);
