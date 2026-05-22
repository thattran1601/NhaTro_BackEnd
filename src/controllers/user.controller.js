const db = require('../config/db');

const userController = {
  // [POST] Đăng nhập
  login: async (req, res) => {
    try {
      const { username, password } = req.body;

      // Kiểm tra dữ liệu đầu vào
      if (!username || !password) {
        return res.status(400).json({ 
          success: false, 
          message: 'Username và password không được để trống' 
        });
      }

      // Tìm user trong database
      const query = 'SELECT * FROM User WHERE Username = ?';
      db.query(query, [username], (err, rows) => {
        if (err) {
          console.error('Lỗi login:', err);
          return res.status(500).json({ 
            success: false, 
            message: 'Lỗi server' 
          });
        }

        // Kiểm tra xem user có tồn tại không
        if (rows.length === 0) {
          return res.status(401).json({ 
            success: false, 
            message: 'Username hoặc password không đúng' 
          });
        }

        const user = rows[0];

        // Kiểm tra mật khẩu
        if (user.Password !== password) {
          return res.status(401).json({ 
            success: false, 
            message: 'Username hoặc password không đúng' 
          });
        }

        // Đăng nhập thành công
        return res.status(200).json({ 
          success: true, 
          message: 'Đăng nhập thành công',
          data: {
            UserID: user.UserID,
            Username: user.Username
          }
        });
      });
    } catch (error) {
      console.error('Lỗi login:', error);
      return res.status(500).json({ 
        success: false, 
        message: 'Lỗi server' 
      });
    }
  }
};

module.exports = userController;
