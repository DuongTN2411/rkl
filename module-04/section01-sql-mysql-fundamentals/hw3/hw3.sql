USE LibraryDB;

INSERT INTO Books (Title, Author, PublishedYear) VALUES
    ('Lập trình React', 'Nguyen Van A', 2021),
    ('Lập trình Python', 'Nguyen Van A', 2019),
    ('Lập trình Node.js', 'Tran Thi B', 2022),
    ('Clean Code', 'Robert C. Martin', 2008),
    ('The Pragmatic Programmer', 'David Thomas', 2019),
    ('Design Patterns', 'Gang of Four', 2000),
    ('Lập trình Java', 'Le Van C', 2023),
    ('SQL cơ bản', 'Pham Thi D', 2021);

SELECT * FROM Books
WHERE PublishedYear > 2020;

SELECT * FROM Books
WHERE Author = 'Nguyen Van A'
   OR Title LIKE 'Lập trình%';

SELECT * FROM Books
ORDER BY PublishedYear DESC, Title ASC
LIMIT 2;
