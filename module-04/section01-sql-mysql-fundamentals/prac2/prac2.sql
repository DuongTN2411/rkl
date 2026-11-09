USE quanly_sinhvien;

INSERT INTO sinh_vien (ho_ten, ngay_sinh, diem_gpa)
VALUES ('Nguyen Van An', '2003-05-15', 3.50);

INSERT INTO sinh_vien (ho_ten, ngay_sinh, diem_gpa) VALUES
    ('Tran Thi Bich',  '2003-08-20', 3.75),
    ('Le Van Cuong',   '2002-11-03', 2.90),
    ('Pham Thi Dung',  '2004-01-17', 3.20),
    ('Hoang Van Em',   '2003-07-09', 3.60),
    ('Ngo Thi Phuong', '2002-03-25', 2.75);

SELECT * FROM sinh_vien;
