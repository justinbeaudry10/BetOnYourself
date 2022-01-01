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
    `SELECT * FROM users WHERE email="${req.body.email}" AND userPassword="${req.body.password}"`,
    (err, rows, fields) => {
      if (err) res.send(err);
      else {
        if (rows.length > 0) {
          req.session.loggedin = true;
          req.session.email = req.body.email;
          res.sendFile(path.join(__dirname, "static/dashboard.html"));
        } else {
          res.send("Incorrect email or password!");
        }
      }
      conn.end();
    }
  );
});

app.get("/accountInfo", (req, res) => {
  let conn = newConnection();
  conn.connect();

  let fullName;

  conn.query(
    `SELECT fName, lName FROM users WHERE email="${req.session.email}"`,
    (err, rows, fields) => {
      if (err) console.log(err);
      else {
        for (r of rows) {
          fullName = r.fName + " " + r.lName;
        }

        res.json({
          fullName: fullName,
        });
      }
      conn.end();
    }
  );
});

// Inserts a new tuple into users table upon signup
app.post("/signup", (req, res) => {
  let conn = newConnection();
  conn.connect();

  conn.query(
    `INSERT INTO users VALUES ("${req.body["email"]}", "${req.body["password"]}", "${req.body["firstName"]}", "${req.body["lastName"]}")`,
    (err, rows, fields) => {
      if (err)
        res.send("An account already exists with this email. Please sign in.");
      else {
        res.send("Account created successfully");
        conn.end();
      }
    }
  );
});

app.listen(3000);
