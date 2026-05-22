const express = require('express');
const router = express.Router();
const khachHangController = require('../controllers/khachhang.controller');
const upload = require('../config/multer');

// Định nghĩa các route cho Khách hàng
router.get('/', khachHangController.getAll);           // Lấy danh sách (có hỗ trợ query ?keyword=...)
router.get('/:id', khachHangController.getById);       // Lấy chi tiết 1 KH theo id
router.post('/', upload.fields([
  { name: 'TruocCCCD', maxCount: 1 },
  { name: 'SauCCCD', maxCount: 1 }
]), khachHangController.create);                        // Thêm mới KH (có upload ảnh CCCD)
router.put('/:id', upload.fields([
  { name: 'TruocCCCD', maxCount: 1 },
  { name: 'SauCCCD', maxCount: 1 }
]), khachHangController.update);                        // Cập nhật thông tin KH (có upload ảnh CCCD)

module.exports = router;