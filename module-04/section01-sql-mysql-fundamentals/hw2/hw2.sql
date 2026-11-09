USE LibraryDB;

SELECT * FROM Books;

INSERT INTO Books (Title, Author, PublishedYear) VALUES
    ('Lập trình React', 'Nguyen Van A', 2021),
    ('Clean Code', 'Robert C. Martin', 2008),
    ('The Pragmatic Programmer', 'David Thomas', 2019);

SELECT * FROM Books;

UPDATE Books
SET PublishedYear = 2022
WHERE BookID = 1;

SELECT * FROM Books;

DELETE FROM Books
WHERE BookID = 2;

SELECT * FROM Books;
