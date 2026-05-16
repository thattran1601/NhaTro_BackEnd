const pool = require('../config/db');

const contractController = {
    // [GET] /api/hopdong
    getAllContracts: async (req, res) => {
        try {
            const { TrangThai } = req.query;
            let query = 'SELECT * FROM hopdong';
            const queryParams = [];

            if (TrangThai !== undefined) {
                query += ' WHERE TrangThai = ?';
                queryParams.push(TrangThai);
            }

            query += ' ORDER BY NgayTao DESC'; // Sắp xếp hợp đồng mới nhất lên đầu
            
            const [rows] = await pool.query(query, queryParams);
            res.status(200).json({ success: true, data: rows });
        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, message: 'Lỗi server' });
        }
    },

    // [POST] /api/hopdong
    createContract: async (req, res) => {
        const connection = await pool.getConnection(); // Dùng connection riêng cho transaction
        try {
            const { MaPhong, MaKH, NgayKT, TienCoc, TrangThai } = req.body;

            // Bắt đầu Transaction
            await connection.beginTransaction();

            // 1. Tạo hợp đồng mới
            const [result] = await connection.query(
                'INSERT INTO hopdong (MaPhong, MaKH, NgayKT, TienCoc, TrangThai) VALUES (?, ?, ?, ?, ?)',
                [MaPhong, MaKH, NgayKT || null, TienCoc || 0, TrangThai || 0]
            );

            // 2. Cập nhật TinhTrang phòng thành 1 (Đã thuê)
            await connection.query(
                'UPDATE phong SET TinhTrang = 1 WHERE MaPhong = ?',
                [MaPhong]
            );

            // Hoàn tất Transaction
            await connection.commit();

            res.status(201).json({ 
                success: true, 
                message: 'Tạo hợp đồng thành công',
                data: { MaHD: result.insertId, ...req.body }
            });
        } catch (error) {
            // Nếu có lỗi, rollback lại toàn bộ
            await connection.rollback();
            console.error(error);
            res.status(500).json({ success: false, message: 'Lỗi khi tạo hợp đồng' });
        } finally {
            connection.release(); // Trả connection lại cho pool
        }
    },

    // [PUT] /api/hopdong/:MaHD
    updateContract: async (req, res) => {
        try {
            const { MaHD } = req.params;
            const { NgayKT, TienCoc, TrangThai } = req.body;

            const [result] = await pool.query(
                'UPDATE hopdong SET NgayKT = ?, TienCoc = ?, TrangThai = ? WHERE MaHD = ?',
                [NgayKT, TienCoc, TrangThai, MaHD]
            );

            if (result.affectedRows === 0) {
                return res.status(404).json({ success: false, message: 'Không tìm thấy hợp đồng' });
            }

            res.status(200).json({ success: true, message: 'Cập nhật thành công' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, message: 'Lỗi server' });
        }
    }
};

module.exports = contractController;