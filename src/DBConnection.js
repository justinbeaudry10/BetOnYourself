const mysql = require("mysql"); //Creating an instance of mysql server and establishing a connection

function newConnection() {
  let conn = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "password!",
    database: "betOnYourself",
  });
  return conn;
}

module.exports = newConnection;
