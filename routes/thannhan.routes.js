const express = require('express');
const router = express.Router();
const thanNhanController = require('../controllers/thannhan.controller');

// Định nghĩa các endpoint cho Module Thân nhân
router.get('/khachhang/:maKH', thanNhanController.getByKhachHang); // Lấy toàn bộ thân nhân của 1 khách hàng cụ thể
router.post('/', thanNhanController.create);                      // Thêm thân nhân mới
router.put('/:id', thanNhanController.update);                    // Cập nhật thân nhân theo MaTN
router.delete('/:id', thanNhanController.delete);                 // Xóa lẻ thân nhân theo MaTN

module.exports = router;