const db = require('../config/db');
const fs = require('fs');
const path = require('path');

const khachHangController = {
  // [GET] Lấy danh sách khách hàng (Có hỗ trợ tìm kiếm theo CCCD hoặc SDT)
  getAll: async (req, res) => {
    try {
      const { keyword } = req.query;
      let query = 'SELECT * FROM khachhang';
      let params = [];

      // Nếu có truyền keyword lên thì tìm kiếm
      if (keyword) {
        query += ' WHERE CCCD LIKE ? OR SDT LIKE ? OR HoTen LIKE ?';
        params = [`%${keyword}%`, `%${keyword}%`, `%${keyword}%`];
      }

      query += ' ORDER BY MaKH DESC';

      db.query(query, params, (err, rows) => {
        if (err) {
          console.error('Lỗi getAll khách hàng:', err);
          return res.status(500).json({ success: false, message: 'Lỗi server' });
        }
        return res.status(200).json({ success: true, data: rows });
      });
    } catch (error) {
      console.error('Lỗi getAll khách hàng:', error);
      return res.status(500).json({ success: false, message: 'Lỗi server' });
    }
  },

  // [GET] Lấy thông tin 1 khách hàng cụ thể
  getById: async (req, res) => {
    try {
      const { id } = req.params;
      db.query('SELECT * FROM khachhang WHERE MaKH = ?', [id], (err, rows) => {
        if (err) {
          console.error('Lỗi getById khách hàng:', err);
          return res.status(500).json({ success: false, message: 'Lỗi server' });
        }

        if (rows.length === 0) {
          return res.status(404).json({ success: false, message: 'Không tìm thấy khách hàng' });
        }
        return res.status(200).json({ success: true, data: rows[0] });
      });
    } catch (error) {
      console.error('Lỗi getById khách hàng:', error);
      return res.status(500).json({ success: false, message: 'Lỗi server' });
    }
  },

  // [POST] Thêm khách hàng mới
  create: async (req, res) => {
    try {
      const { HoTen, CCCD, SDT } = req.body;

      // Validate cơ bản
      if (!HoTen || !CCCD || !SDT) {
        // Xóa file nếu upload thất bại
        if (req.files) {
          req.files.forEach(file => {
            const filePath = path.join(__dirname, '../../uploads/cccd', file.filename);
            fs.unlink(filePath, (err) => {
              if (err) console.error('Lỗi xóa file:', err);
            });
          });
        }
        return res.status(400).json({ success: false, message: 'Vui lòng nhập đủ các trường bắt buộc (HoTen, CCCD, SDT)' });
      }

      // Kiểm tra xem CCCD đã tồn tại chưa (vì CCCD là UNIQUE key)
      db.query('SELECT MaKH FROM khachhang WHERE CCCD = ?', [CCCD], (err, existKH) => {
        if (err) {
          console.error('Lỗi create khách hàng:', err);
          // Xóa file nếu có lỗi
          if (req.files) {
            req.files.forEach(file => {
              const filePath = path.join(__dirname, '../../uploads/cccd', file.filename);
              fs.unlink(filePath, (err) => {
                if (err) console.error('Lỗi xóa file:', err);
              });
            });
          }
          return res.status(500).json({ success: false, message: 'Lỗi server' });
        }

        if (existKH.length > 0) {
          // Xóa file nếu CCCD đã tồn tại
          if (req.files) {
            req.files.forEach(file => {
              const filePath = path.join(__dirname, '../../uploads/cccd', file.filename);
              fs.unlink(filePath, (err) => {
                if (err) console.error('Lỗi xóa file:', err);
              });
            });
          }
          return res.status(400).json({ success: false, message: 'Số CCCD này đã tồn tại trong hệ thống' });
        }

        // Lấy tên file từ upload
        const TruocCCCD = req.files && req.files['TruocCCCD'] ? req.files['TruocCCCD'][0].filename : null;
        const SauCCCD = req.files && req.files['SauCCCD'] ? req.files['SauCCCD'][0].filename : null;

        const query = 'INSERT INTO khachhang (HoTen, CCCD, TruocCCCD, SauCCCD, SDT) VALUES (?, ?, ?, ?, ?)';
        db.query(query, [HoTen, CCCD, TruocCCCD, SauCCCD, SDT], (insertErr, result) => {
          if (insertErr) {
            console.error('Lỗi create khách hàng:', insertErr);
            // Xóa file nếu insert thất bại
            if (req.files) {
              req.files.forEach(file => {
                const filePath = path.join(__dirname, '../../uploads/cccd', file.filename);
                fs.unlink(filePath, (err) => {
                  if (err) console.error('Lỗi xóa file:', err);
                });
              });
            }
            return res.status(500).json({ success: false, message: 'Lỗi server' });
          }

          return res.status(201).json({ 
            success: true, 
            message: 'Thêm khách hàng thành công', 
            data: { 
              MaKH: result.insertId, 
              HoTen, 
              CCCD, 
              TruocCCCD,
              SauCCCD,
              SDT 
            }
          });
        });
      });
    } catch (error) {
      console.error('Lỗi create khách hàng:', error);
      // Xóa file nếu có exception
      if (req.files) {
        req.files.forEach(file => {
          const filePath = path.join(__dirname, '../../uploads/cccd', file.filename);
          fs.unlink(filePath, (err) => {
            if (err) console.error('Lỗi xóa file:', err);
          });
        });
      }
      return res.status(500).json({ success: false, message: 'Lỗi server' });
    }
  },

  // [PUT] Chỉnh sửa thông tin khách hàng
  update: async (req, res) => {
    try {
      const { id } = req.params;
      const { HoTen, CCCD, SDT } = req.body;

      // Kiểm tra KH có tồn tại không
      db.query('SELECT * FROM khachhang WHERE MaKH = ?', [id], (err, checkKH) => {
        if (err) {
          console.error('Lỗi update khách hàng:', err);
          // Xóa file nếu có lỗi
          if (req.files) {
            req.files.forEach(file => {
              const filePath = path.join(__dirname, '../../uploads/cccd', file.filename);
              fs.unlink(filePath, (err) => {
                if (err) console.error('Lỗi xóa file:', err);
              });
            });
          }
          return res.status(500).json({ success: false, message: 'Lỗi server' });
        }

        if (checkKH.length === 0) {
          // Xóa file nếu không tìm thấy KH
          if (req.files) {
            req.files.forEach(file => {
              const filePath = path.join(__dirname, '../../uploads/cccd', file.filename);
              fs.unlink(filePath, (err) => {
                if (err) console.error('Lỗi xóa file:', err);
              });
            });
          }
          return res.status(404).json({ success: false, message: 'Không tìm thấy khách hàng để cập nhật' });
        }

        const processUpdate = () => {
          // Xóa file cũ nếu có file mới được upload
          const khachHangCurrent = checkKH[0];
          
          if (req.files && req.files['TruocCCCD'] && khachHangCurrent.TruocCCCD) {
            const oldFilePath = path.join(__dirname, '../../uploads/cccd', khachHangCurrent.TruocCCCD);
            fs.unlink(oldFilePath, (err) => {
              if (err) console.error('Lỗi xóa file cũ:', err);
            });
          }
          
          if (req.files && req.files['SauCCCD'] && khachHangCurrent.SauCCCD) {
            const oldFilePath = path.join(__dirname, '../../uploads/cccd', khachHangCurrent.SauCCCD);
            fs.unlink(oldFilePath, (err) => {
              if (err) console.error('Lỗi xóa file cũ:', err);
            });
          }

          // Lấy tên file hoặc giữ giá trị cũ
          const TruocCCCD = req.files && req.files['TruocCCCD'] ? req.files['TruocCCCD'][0].filename : khachHangCurrent.TruocCCCD;
          const SauCCCD = req.files && req.files['SauCCCD'] ? req.files['SauCCCD'][0].filename : khachHangCurrent.SauCCCD;

          const query = 'UPDATE khachhang SET HoTen = ?, CCCD = ?, TruocCCCD = ?, SauCCCD = ?, SDT = ? WHERE MaKH = ?';
          db.query(query, [HoTen, CCCD, TruocCCCD, SauCCCD, SDT, id], (updateErr) => {
            if (updateErr) {
              console.error('Lỗi update khách hàng:', updateErr);
              // Xóa file nếu update thất bại
              if (req.files) {
                req.files.forEach(file => {
                  const filePath = path.join(__dirname, '../../uploads/cccd', file.filename);
                  fs.unlink(filePath, (err) => {
                    if (err) console.error('Lỗi xóa file:', err);
                  });
                });
              }
              return res.status(500).json({ success: false, message: 'Lỗi server' });
            }

            return res.status(200).json({ success: true, message: 'Cập nhật thông tin khách hàng thành công' });
          });
        };

        // Kiểm tra CCCD mới có bị trùng với người khác không
        if (CCCD && CCCD !== checkKH[0].CCCD) {
          db.query('SELECT MaKH FROM khachhang WHERE CCCD = ? AND MaKH != ?', [CCCD, id], (duplicateErr, existKH) => {
            if (duplicateErr) {
              console.error('Lỗi update khách hàng:', duplicateErr);
              // Xóa file nếu có lỗi
              if (req.files) {
                req.files.forEach(file => {
                  const filePath = path.join(__dirname, '../../uploads/cccd', file.filename);
                  fs.unlink(filePath, (err) => {
                    if (err) console.error('Lỗi xóa file:', err);
                  });
                });
              }
              return res.status(500).json({ success: false, message: 'Lỗi server' });
            }

            if (existKH.length > 0) {
              // Xóa file nếu CCCD trùng
              if (req.files) {
                req.files.forEach(file => {
                  const filePath = path.join(__dirname, '../../uploads/cccd', file.filename);
                  fs.unlink(filePath, (err) => {
                    if (err) console.error('Lỗi xóa file:', err);
                  });
                });
              }
              return res.status(400).json({ success: false, message: 'Số CCCD này đã được sử dụng cho một khách hàng khác' });
            }

            return processUpdate();
          });
        } else {
          return processUpdate();
        }
      });
    } catch (error) {
      console.error('Lỗi update khách hàng:', error);
      // Xóa file nếu có exception
      if (req.files) {
        req.files.forEach(file => {
          const filePath = path.join(__dirname, '../../uploads/cccd', file.filename);
          fs.unlink(filePath, (err) => {
            if (err) console.error('Lỗi xóa file:', err);
          });
        });
      }
      return res.status(500).json({ success: false, message: 'Lỗi server' });
    }
  }
};

module.exports = khachHangController;