USE quanly_sinhvien;

SELECT * FROM sinh_vien;

UPDATE sinh_vien
SET email = 'nguyenvanan@email.com'
WHERE id = 1;

SELECT * FROM sinh_vien;

DELETE FROM sinh_vien
WHERE id = 6;

SELECT * FROM sinh_vien;

DELETE FROM sinh_vien
WHERE diem_gpa < 3.00;

SELECT * FROM sinh_vien;

-- LƯU Ý: Nếu không có mệnh đề WHERE trong câu lệnh UPDATE hoặc DELETE,
-- toàn bộ dữ liệu trong bảng sẽ bị ảnh hưởng.
-- Ví dụ: DELETE FROM sinh_vien; sẽ XÓA TẤT CẢ bản ghi trong bảng.
-- Luôn kiểm tra kỹ điều kiện WHERE trước khi thực thi.
