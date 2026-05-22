const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Tạo thư mục nếu chưa tồn tại
const uploadDir = path.join(__dirname, '../..', 'uploads/cccd');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Cấu hình storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // Tạo tên file duy nhất: timestamp + random + extension
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    const name = path.basename(file.originalname, ext);
    cb(null, name + '-' + uniqueSuffix + ext);
  }
});

// Filter để chỉ cho phép ảnh
const fileFilter = (req, file, cb) => {
  // Kiểm tra loại file
  const allowedMimes = ['image/jpeg', 'image/png', 'image/jpg'];
  
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Chỉ cho phép file ảnh (JPEG, PNG, JPG)'), false);
  }
};

// Tạo upload middleware
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // Giới hạn 5MB
  }
});

module.exports = upload;
