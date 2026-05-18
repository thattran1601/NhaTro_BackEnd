const db = require('../config/db'); // Đường dẫn tới file cấu hình kết nối database của bạn

const thanNhanController = {
  // [GET] Lấy danh sách thân nhân của một khách hàng cụ thể
  getByKhachHang: async (req, res) => {
    try {
      const { maKH } = req.params;

      // Kiểm tra xem khách hàng có tồn tại không
      db.query('SELECT MaKH FROM khachhang WHERE MaKH = ?', [maKH], (err, khachHang) => {
        if (err) {
          console.error('Lỗi getByKhachHang thân nhân:', err);
          return res.status(500).json({ success: false, message: 'Lỗi máy chủ nội bộ' });
        }

        if (khachHang.length === 0) {
          return res.status(404).json({ success: false, message: 'Không tìm thấy thông tin khách hàng này' });
        }

        // Truy vấn danh sách thân nhân thuộc khách hàng đó
        const query = 'SELECT * FROM thannhan WHERE MaKH = ? ORDER BY MaTN DESC';
        db.query(query, [maKH], (queryErr, rows) => {
          if (queryErr) {
            console.error('Lỗi getByKhachHang thân nhân:', queryErr);
            return res.status(500).json({ success: false, message: 'Lỗi máy chủ nội bộ' });
          }

          return res.status(200).json({ success: true, data: rows });
        });
      });
    } catch (error) {
      console.error('Lỗi getByKhachHang thân nhân:', error);
      return res.status(500).json({ success: false, message: 'Lỗi máy chủ nội bộ' });
    }
  },

  // [POST] Thêm thân nhân mới cho một khách hàng
  create: async (req, res) => {
    try {
      const { MaKH, HoTen, SDT, QuanHe } = req.body;

      // Kiểm tra dữ liệu bắt buộc đầu vào
      if (!MaKH || !HoTen || !SDT) {
        return res.status(400).json({ success: false, message: 'Vui lòng cung cấp đầy đủ thông tin (MaKH, HoTen, SDT)' });
      }

      // Kiểm tra xem khách hàng (người thuê) có tồn tại thực tế không
      db.query('SELECT MaKH FROM khachhang WHERE MaKH = ?', [MaKH], (err, khachHang) => {
        if (err) {
          console.error('Lỗi create thân nhân:', err);
          return res.status(500).json({ success: false, message: 'Lỗi máy chủ nội bộ' });
        }

        if (khachHang.length === 0) {
          return res.status(404).json({ success: false, message: 'Khách hàng không tồn tại, không thể thêm thân nhân' });
        }

        const query = 'INSERT INTO thannhan (MaKH, HoTen, SDT, QuanHe) VALUES (?, ?, ?, ?)';
        db.query(query, [MaKH, HoTen, SDT, QuanHe || null], (insertErr, result) => {
          if (insertErr) {
            console.error('Lỗi create thân nhân:', insertErr);
            return res.status(500).json({ success: false, message: 'Lỗi máy chủ nội bộ' });
          }

          return res.status(201).json({
            success: true,
            message: 'Thêm thân nhân thành công',
            data: { MaTN: result.insertId, MaKH, HoTen, SDT, QuanHe }
          });
        });
      });
    } catch (error) {
      console.error('Lỗi create thân nhân:', error);
      return res.status(500).json({ success: false, message: 'Lỗi máy chủ nội bộ' });
    }
  },

  // [PUT] Chỉnh sửa thông tin thân nhân
  update: async (req, res) => {
    try {
      const { id } = req.params; // MaTN nhận từ URL
      const { HoTen, SDT, QuanHe } = req.body;

      // Kiểm tra sự tồn tại của bản ghi thân nhân cần sửa
      db.query('SELECT MaTN FROM thannhan WHERE MaTN = ?', [id], (err, checkTN) => {
        if (err) {
          console.error('Lỗi update thân nhân:', err);
          return res.status(500).json({ success: false, message: 'Lỗi máy chủ nội bộ' });
        }

        if (checkTN.length === 0) {
          return res.status(404).json({ success: false, message: 'Không tìm thấy thông tin thân nhân để cập nhật' });
        }

        // Kiểm tra dữ liệu bắt buộc khi sửa
        if (!HoTen || !SDT) {
          return res.status(400).json({ success: false, message: 'Họ tên và Số điện thoại không được bỏ trống' });
        }

        const query = 'UPDATE thannhan SET HoTen = ?, SDT = ?, QuanHe = ? WHERE MaTN = ?';
        db.query(query, [HoTen, SDT, QuanHe || null, id], (updateErr) => {
          if (updateErr) {
            console.error('Lỗi update thân nhân:', updateErr);
            return res.status(500).json({ success: false, message: 'Lỗi máy chủ nội bộ' });
          }

          return res.status(200).json({ success: true, message: 'Cập nhật thông tin thân nhân thành công' });
        });
      });
    } catch (error) {
      console.error('Lỗi update thân nhân:', error);
      return res.status(500).json({ success: false, message: 'Lỗi máy chủ nội bộ' });
    }
  },

  // [DELETE] Xóa thân nhân
  delete: async (req, res) => {
    try {
      const { id } = req.params; // MaTN nhận từ URL

      // Kiểm tra xem thân nhân có tồn tại không trước khi xóa
      db.query('SELECT MaTN FROM thannhan WHERE MaTN = ?', [id], (err, checkTN) => {
        if (err) {
          console.error('Lỗi delete thân nhân:', err);
          return res.status(500).json({ success: false, message: 'Lỗi máy chủ nội bộ' });
        }

        if (checkTN.length === 0) {
          return res.status(404).json({ success: false, message: 'Không tìm thấy thông tin thân nhân để xóa' });
        }

        const query = 'DELETE FROM thannhan WHERE MaTN = ?';
        db.query(query, [id], (deleteErr) => {
          if (deleteErr) {
            console.error('Lỗi delete thân nhân:', deleteErr);
            return res.status(500).json({ success: false, message: 'Lỗi máy chủ nội bộ' });
          }

          return res.status(200).json({ success: true, message: 'Xóa thân nhân thành công' });
        });
      });
    } catch (error) {
      console.error('Lỗi delete thân nhân:', error);
      return res.status(500).json({ success: false, message: 'Lỗi máy chủ nội bộ' });
    }
  }
};

module.exports = thanNhanController;