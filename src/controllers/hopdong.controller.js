const db = require('../config/db');

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
            
            db.query(query, queryParams, (err, rows) => {
                if (err) {
                    console.error(err);
                    return res.status(500).json({ success: false, message: 'Lỗi server' });
                }
                return res.status(200).json({ success: true, data: rows });
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, message: 'Lỗi server' });
        }
    },

    // [POST] /api/hopdong
    createContract: async (req, res) => {
        const { MaPhong, MaKH, NgayKT, TienCoc, TrangThai } = req.body;

        db.beginTransaction((beginErr) => {
            if (beginErr) {
                console.error(beginErr);
                return res.status(500).json({ success: false, message: 'Lỗi khi bắt đầu transaction' });
            }

            db.query(
                'INSERT INTO hopdong (MaPhong, MaKH, NgayKT, TienCoc, TrangThai) VALUES (?, ?, ?, ?, ?)',
                [MaPhong, MaKH, NgayKT || null, TienCoc || 0, TrangThai || 0],
                (insertErr, result) => {
                    if (insertErr) {
                        return db.rollback(() => {
                            console.error(insertErr);
                            return res.status(500).json({ success: false, message: 'Lỗi khi tạo hợp đồng' });
                        });
                    }

                    db.query(
                        'UPDATE phong SET TinhTrang = 1 WHERE MaPhong = ?',
                        [MaPhong],
                        (updateErr) => {
                            if (updateErr) {
                                return db.rollback(() => {
                                    console.error(updateErr);
                                    return res.status(500).json({ success: false, message: 'Lỗi khi cập nhật trạng thái phòng' });
                                });
                            }

                            db.commit((commitErr) => {
                                if (commitErr) {
                                    return db.rollback(() => {
                                        console.error(commitErr);
                                        return res.status(500).json({ success: false, message: 'Lỗi khi hoàn tất transaction' });
                                    });
                                }

                                return res.status(201).json({
                                    success: true,
                                    message: 'Tạo hợp đồng thành công',
                                    data: { MaHD: result.insertId, MaPhong, MaKH, NgayKT, TienCoc, TrangThai }
                                });
                            });
                        }
                    );
                }
            );
        });
    },

    // [PUT] /api/hopdong/:MaHD
    updateContract: async (req, res) => {
        try {
            const { MaHD } = req.params;
            const { NgayKT, TienCoc, TrangThai } = req.body;

            db.query(
                'UPDATE hopdong SET NgayKT = ?, TienCoc = ?, TrangThai = ? WHERE MaHD = ?',
                [NgayKT, TienCoc, TrangThai, MaHD],
                (err, result) => {
                    if (err) {
                        console.error(err);
                        return res.status(500).json({ success: false, message: 'Lỗi server' });
                    }

                    if (result.affectedRows === 0) {
                        return res.status(404).json({ success: false, message: 'Không tìm thấy hợp đồng' });
                    }

                    return res.status(200).json({ success: true, message: 'Cập nhật thành công' });
                }
            );
        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, message: 'Lỗi server' });
        }
    }
};

module.exports = contractController;