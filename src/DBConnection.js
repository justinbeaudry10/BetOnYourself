const mysql = require("mysql"); //Creating an instance of mysql server and establishing a connection

function newConnection() {
  let conn = mysql.createConnection({
    host: "db4free.net",
    port: 3306,
    user: "justinbeaudry",
    password: "fvv23allstar",
    database: "betonyourself",
  });
  return conn;
}

module.exports = newConnection;
