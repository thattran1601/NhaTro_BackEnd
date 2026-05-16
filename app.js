const express = require('express');
const cors = require('cors');
require('dotenv').config();

const contractRoutes = require('./routes/hopdong.routes');
const khachHangRoutes = require('./routes/khachhang.routes');
const thanNhanRoutes = require('./routes/thannhan.routes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.status(200).json({ success: true, message: 'API backend is running' });
});

app.use('/api/hopdong', contractRoutes);
app.use('/api/khachhang', khachHangRoutes);
app.use('/api/thannhan', thanNhanRoutes);

app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ success: false, message: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
