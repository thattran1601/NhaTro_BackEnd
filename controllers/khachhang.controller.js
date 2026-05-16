const pool = require('../config/db'); // Lưu ý đường dẫn trỏ đúng tới db.js của bạn

const khachHangController = {
  // [GET] Lấy danh sách khách hàng (Có hỗ trợ tìm kiếm theo CCCD hoặc SDT)
  getAll: async (req, res) => {
    try {
      const { keyword } = req.query;
      let query = 'SELECT * FROM khachhang';
      let params = [];

      // Nếu có truyền keyword lên thì tìm kiếm
      if (keyword) {
        query += ' WHERE CCCD LIKE ? OR SDT LIKE ?';
        params = [`%${keyword}%`, `%${keyword}%`];
      }

      query += ' ORDER BY MaKH DESC';

      const [rows] = await pool.execute(query, params);
      return res.status(200).json({ success: true, data: rows });
    } catch (error) {
      console.error('Lỗi getAll khách hàng:', error);
      return res.status(500).json({ success: false, message: 'Lỗi server' });
    }
  },

  // [GET] Lấy thông tin 1 khách hàng cụ thể
  getById: async (req, res) => {
    try {
      const { id } = req.params;
      const [rows] = await pool.execute('SELECT * FROM khachhang WHERE MaKH = ?', [id]);
      
      if (rows.length === 0) {
        return res.status(404).json({ success: false, message: 'Không tìm thấy khách hàng' });
      }
      return res.status(200).json({ success: true, data: rows[0] });
    } catch (error) {
      console.error('Lỗi getById khách hàng:', error);
      return res.status(500).json({ success: false, message: 'Lỗi server' });
    }
  },

  // [POST] Thêm khách hàng mới
  create: async (req, res) => {
    try {
      const { HoTen, CCCD, AnhCCCD, SDT } = req.body;

      // Validate cơ bản
      if (!HoTen || !CCCD || !SDT) {
        return res.status(400).json({ success: false, message: 'Vui lòng nhập đủ các trường bắt buộc (HoTen, CCCD, SDT)' });
      }

      // Kiểm tra xem CCCD đã tồn tại chưa (vì CCCD là UNIQUE key)
      const [existKH] = await pool.execute('SELECT MaKH FROM khachhang WHERE CCCD = ?', [CCCD]);
      if (existKH.length > 0) {
        return res.status(400).json({ success: false, message: 'Số CCCD này đã tồn tại trong hệ thống' });
      }

      const query = 'INSERT INTO khachhang (HoTen, CCCD, AnhCCCD, SDT) VALUES (?, ?, ?, ?)';
      const [result] = await pool.execute(query, [HoTen, CCCD, AnhCCCD || null, SDT]);

      return res.status(201).json({ 
        success: true, 
        message: 'Thêm khách hàng thành công', 
        data: { MaKH: result.insertId, HoTen, CCCD, AnhCCCD, SDT }
      });
    } catch (error) {
      console.error('Lỗi create khách hàng:', error);
      return res.status(500).json({ success: false, message: 'Lỗi server' });
    }
  },

  // [PUT] Chỉnh sửa thông tin khách hàng
  update: async (req, res) => {
    try {
      const { id } = req.params;
      const { HoTen, CCCD, AnhCCCD, SDT } = req.body;

      // Kiểm tra KH có tồn tại không
      const [checkKH] = await pool.execute('SELECT MaKH FROM khachhang WHERE MaKH = ?', [id]);
      if (checkKH.length === 0) {
        return res.status(404).json({ success: false, message: 'Không tìm thấy khách hàng để cập nhật' });
      }

      // Kiểm tra CCCD mới có bị trùng với người khác không
      if (CCCD) {
        const [existKH] = await pool.execute('SELECT MaKH FROM khachhang WHERE CCCD = ? AND MaKH != ?', [CCCD, id]);
        if (existKH.length > 0) {
          return res.status(400).json({ success: false, message: 'Số CCCD này đã được sử dụng cho một khách hàng khác' });
        }
      }

      const query = 'UPDATE khachhang SET HoTen = ?, CCCD = ?, AnhCCCD = ?, SDT = ? WHERE MaKH = ?';
      await pool.execute(query, [HoTen, CCCD, AnhCCCD || null, SDT, id]);

      return res.status(200).json({ success: true, message: 'Cập nhật thông tin khách hàng thành công' });
    } catch (error) {
      console.error('Lỗi update khách hàng:', error);
      return res.status(500).json({ success: false, message: 'Lỗi server' });
    }
  }
};

module.exports = khachHangController;