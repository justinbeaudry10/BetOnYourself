CREATE DATABASE betOnYourself;
USE betOnYourself;

CREATE TABLE users (
	email VARCHAR(100) NOT NULL PRIMARY KEY,
    userPassword VARCHAR(50),
    fName VARCHAR(30),
    lName VARCHAR(30)
);

CREATE TABLE bets (
	betNo INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
	book VARCHAR(50),
    league VARCHAR(40),
    betEvent VARCHAR(100),
    selection VARCHAR(200),
	stake DECIMAL(10, 2),
    odds DECIMAL(10, 3),
    datePlaced DATE,
    betStatus VARCHAR(10),
    bettor VARCHAR(100),
    FOREIGN KEY (bettor) REFERENCES users(email)
);

