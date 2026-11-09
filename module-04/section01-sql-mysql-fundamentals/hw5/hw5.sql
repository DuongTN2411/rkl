USE LibraryDB;

CREATE TABLE Customers (
    CustomerID   INT           NOT NULL AUTO_INCREMENT,
    FullName     VARCHAR(150)  NOT NULL,
    Email        VARCHAR(255),
    PRIMARY KEY (CustomerID)
);

CREATE TABLE Orders (
    OrderID      INT           NOT NULL AUTO_INCREMENT,
    CustomerID   INT           NOT NULL,
    BookID       INT           NOT NULL,
    OrderDate    DATE,
    PRIMARY KEY (OrderID),
    FOREIGN KEY (CustomerID) REFERENCES Customers(CustomerID),
    FOREIGN KEY (BookID)     REFERENCES Books(BookID)
);

INSERT INTO Books (Title, Author, PublishedYear, Price) VALUES
    ('Lập trình React', 'Nguyen Van A', 2021, 150000),
    ('Clean Code',      'Robert C. Martin', 2008, 200000),
    ('SQL cơ bản',      'Pham Thi D', 2021, 120000);

INSERT INTO Customers (FullName, Email) VALUES
    ('Tran Thi B', 'tranthib@email.com'),
    ('Le Van C',   'levanc@email.com');

INSERT INTO Orders (CustomerID, BookID, OrderDate) VALUES
    (1, 1, '2024-01-10'),
    (1, 3, '2024-02-05'),
    (2, 2, '2024-03-15');

SELECT
    o.OrderID,
    c.FullName  AS CustomerName,
    b.Title     AS BookTitle,
    o.OrderDate
FROM Orders o
JOIN Customers c ON o.CustomerID = c.CustomerID
JOIN Books     b ON o.BookID     = b.BookID;
