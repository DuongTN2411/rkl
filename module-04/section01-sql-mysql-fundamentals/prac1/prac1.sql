CREATE DATABASE IF NOT EXISTS quanly_sinhvien;

USE quanly_sinhvien;

CREATE TABLE sinh_vien (
    id        INT            NOT NULL AUTO_INCREMENT,
    ho_ten    VARCHAR(150)   NOT NULL,
    ngay_sinh DATE,
    diem_gpa  DECIMAL(3, 2),
    PRIMARY KEY (id)
);
