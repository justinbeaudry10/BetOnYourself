CREATE DATABASE betOnYourself;
USE betOnYourself;

CREATE TABLE users (
	username VARCHAR(20) NOT NULL PRIMARY KEY,
    userPassword VARCHAR(20),
    fName VARCHAR(15),
    lName VARCHAR(15)
);

CREATE TABLE bets (
	betNo INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
	book VARCHAR(20),
    league VARCHAR(10),
    betEvent VARCHAR(25),
    selection VARCHAR(50),
	stake DECIMAL(10, 2),
    odds DECIMAL(10, 2),
    datePlaced DATE,
    betStatus VARCHAR(10),
    bettor VARCHAR(20),
    FOREIGN KEY (bettor) REFERENCES users(username)
);

