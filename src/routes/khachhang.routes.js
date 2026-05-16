const express = require('express');
const router = express.Router();
const khachHangController = require('../controllers/khachhang.controller');

// Định nghĩa các route cho Khách hàng
router.get('/', khachHangController.getAll);           // Lấy danh sách (có hỗ trợ query ?keyword=...)
router.get('/:id', khachHangController.getById);       // Lấy chi tiết 1 KH theo id
router.post('/', khachHangController.create);          // Thêm mới KH
router.put('/:id', khachHangController.update);        // Cập nhật thông tin KH

module.exports = router;