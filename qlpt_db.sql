-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Máy chủ: 127.0.0.1:3306
-- Thời gian đã tạo: Th5 22, 2026 lúc 02:58 AM
-- Phiên bản máy phục vụ: 9.1.0
-- Phiên bản PHP: 8.3.14

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";

START TRANSACTION;

SET time_zone = "+00:00";

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */
;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */
;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */
;
/*!40101 SET NAMES utf8mb4 */
;

--
-- Cơ sở dữ liệu: `qlpt_db`
--
CREATE DATABASE IF NOT EXISTS `qlpt_db` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE `qlpt_db`;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `hopdong`
--

DROP TABLE IF EXISTS `hopdong`;

CREATE TABLE IF NOT EXISTS `hopdong` (
    `MaHD` int NOT NULL AUTO_INCREMENT,
    `MaPhong` int NOT NULL,
    `MaKH` int NOT NULL,
    `NgayTao` date NOT NULL,
    `NgayKT` date NOT NULL,
    `TienCoc` decimal(15, 2) NOT NULL DEFAULT '0.00',
    `TrangThai` tinyint NOT NULL DEFAULT '1',
    PRIMARY KEY (`MaHD`),
    KEY `MaPhong` (`MaPhong`),
    KEY `MaKH` (`MaKH`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `khachhang`
--

DROP TABLE IF EXISTS `khachhang`;

CREATE TABLE IF NOT EXISTS `khachhang` (
    `MaKH` int NOT NULL AUTO_INCREMENT,
    `HoTen` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
    `CCCD` varchar(12) COLLATE utf8mb4_unicode_ci NOT NULL,
    `TruocCCCD` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    `SauCCCD` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    `SDT` varchar(15) COLLATE utf8mb4_unicode_ci NOT NULL,
    PRIMARY KEY (`MaKH`),
    UNIQUE KEY `CCCD` (`CCCD`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `phong`
--

DROP TABLE IF EXISTS `phong`;

CREATE TABLE IF NOT EXISTS `phong` (
    `MaPhong` int NOT NULL AUTO_INCREMENT,
    `TenPhong` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
    `GiaThue` decimal(15, 2) NOT NULL,
    `SoNguoi` tinyint NOT NULL DEFAULT '1',
    `TinhTrang` tinyint NOT NULL DEFAULT '0',
    PRIMARY KEY (`MaPhong`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `thannhan`
--

DROP TABLE IF EXISTS `thannhan`;

CREATE TABLE IF NOT EXISTS `thannhan` (
    `MaTN` int NOT NULL AUTO_INCREMENT,
    `MaKH` int NOT NULL,
    `HoTen` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
    `SDT` varchar(15) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    `QuanHe` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    PRIMARY KEY (`MaTN`),
    KEY `MaKH` (`MaKH`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `thietbi`
--

DROP TABLE IF EXISTS `thietbi`;

CREATE TABLE IF NOT EXISTS `thietbi` (
    `MaTB` int NOT NULL AUTO_INCREMENT,
    `TenTB` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
    `SoSeri` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    PRIMARY KEY (`MaTB`),
    UNIQUE KEY `SoSeri` (`SoSeri`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `thietbiphong`
--

DROP TABLE IF EXISTS `thietbiphong`;

CREATE TABLE IF NOT EXISTS `thietbiphong` (
    `MaPhong` int NOT NULL,
    `MaTB` int NOT NULL,
    `TinhTrang` tinyint NOT NULL DEFAULT '1',
    PRIMARY KEY (`MaPhong`, `MaTB`),
    KEY `MaTB` (`MaTB`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `user`
--

DROP TABLE IF EXISTS `user`;

CREATE TABLE IF NOT EXISTS `user` (
    `UserID` int NOT NULL AUTO_INCREMENT,
    `Username` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
    `Password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
    PRIMARY KEY (`UserID`),
    UNIQUE KEY `Username` (`Username`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

--
-- Đổ dữ liệu cho bảng `user`
--
INSERT INTO `User` (`Username`, `Password`) VALUES ('admin', '123');

--
-- Các ràng buộc cho các bảng đã đổ
--

--
-- Các ràng buộc cho bảng `hopdong`
--
ALTER TABLE `hopdong`
ADD CONSTRAINT `hopdong_ibfk_1` FOREIGN KEY (`MaPhong`) REFERENCES `phong` (`MaPhong`),
ADD CONSTRAINT `hopdong_ibfk_2` FOREIGN KEY (`MaKH`) REFERENCES `khachhang` (`MaKH`);

--
-- Các ràng buộc cho bảng `thannhan`
--
ALTER TABLE `thannhan`
ADD CONSTRAINT `thannhan_ibfk_1` FOREIGN KEY (`MaKH`) REFERENCES `khachhang` (`MaKH`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `thietbiphong`
--
ALTER TABLE `thietbiphong`
ADD CONSTRAINT `thietbiphong_ibfk_1` FOREIGN KEY (`MaPhong`) REFERENCES `phong` (`MaPhong`) ON DELETE CASCADE,
ADD CONSTRAINT `thietbiphong_ibfk_2` FOREIGN KEY (`MaTB`) REFERENCES `thietbi` (`MaTB`) ON DELETE CASCADE;

COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */
;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */
;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */
;