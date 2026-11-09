CREATE DATABASE IF NOT EXISTS LibraryDB;

USE LibraryDB;

CREATE TABLE Books (
    BookID      INT            NOT NULL AUTO_INCREMENT,
    Title       VARCHAR(255)   NOT NULL,
    Author      VARCHAR(100),
    PublishedYear INT,
    PRIMARY KEY (BookID)
);
