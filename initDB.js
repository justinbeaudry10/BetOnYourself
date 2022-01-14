const newConnection = require("./DBConnection");

let conn = newConnection();

conn.query(`DROP TABLE IF EXISTS legs;`, (err, rows, fields) => {
  if (err) console.log(err);
});
conn.query(`DROP TABLE IF EXISTS bets;`, (err, rows, fields) => {
  if (err) console.log(err);
});
conn.query(`DROP TABLE IF EXISTS users;`, (err, rows, fields) => {
  if (err) console.log(err);
});
conn.query(
  `CREATE TABLE users (
	email VARCHAR(100) NOT NULL PRIMARY KEY,
    userPassword VARCHAR(50),
    fName VARCHAR(30),
    lName VARCHAR(30)
);`,
  (err, rows, fields) => {
    if (err) console.log(err);
  }
);
conn.query(
  `CREATE TABLE bets (
	betNo INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
	book VARCHAR(50),
	stake DECIMAL(10, 2),
    odds DECIMAL(10, 3),
    datePlaced DATE,
    betStatus VARCHAR(10),
    returnAmt DECIMAL(10, 2),
    bettor VARCHAR(100),
    FOREIGN KEY (bettor) REFERENCES users(email)
);`,
  (err, rows, fields) => {
    if (err) console.log(err);
  }
);
conn.query(
  `CREATE TABLE legs (
	legNo INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
	league VARCHAR(40),
    betEvent VARCHAR(100),
    selection VARCHAR(200),
    betNo INT NOT NULL,
    FOREIGN KEY (betNo) REFERENCES bets(betNo) ON DELETE CASCADE
);`,
  (err, rows, fields) => {
    if (err) console.log(err);
  }
);

conn.end();
