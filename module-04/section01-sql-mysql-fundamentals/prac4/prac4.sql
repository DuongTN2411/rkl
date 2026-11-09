USE quanly_sinhvien;

SELECT ho_ten AS HoTen, diem_gpa AS DiemGPA
FROM sinh_vien;

SELECT ho_ten, diem_gpa
FROM sinh_vien
WHERE diem_gpa >= 3.50;

SELECT ho_ten, diem_gpa
FROM sinh_vien
WHERE diem_gpa >= 3.00 AND ho_ten LIKE 'Nguyen%';

SELECT ho_ten, diem_gpa
FROM sinh_vien
ORDER BY diem_gpa DESC
LIMIT 3;
