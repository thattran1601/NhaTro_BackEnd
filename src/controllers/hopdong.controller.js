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

    // [GET] /api/hopdong/phong/:MaPhong
    getContractsByRoom: async (req, res) => {
        try {
            const { MaPhong } = req.params;
            const { TrangThai } = req.query;

            let query = 'SELECT * FROM hopdong WHERE MaPhong = ?';
            const queryParams = [MaPhong];

            if (TrangThai !== undefined) {
                query += ' AND TrangThai = ?';
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
        const { MaPhong, MaKH, NgayTao, NgayKT, TienCoc, TrangThai } = req.body;

        // If NgayTao not provided, default to today's date (YYYY-MM-DD)
        const ngayTaoValue = NgayTao ? NgayTao : new Date().toISOString().slice(0, 10);

        db.beginTransaction((beginErr) => {
            if (beginErr) {
                console.error(beginErr);
                return res.status(500).json({ success: false, message: 'Lỗi khi bắt đầu transaction' });
            }

            // Bước 1: Lấy thông tin phòng (SoNguoi)
            db.query('SELECT SoNguoi FROM phong WHERE MaPhong = ?', [MaPhong], (getRoomErr, roomRows) => {
                if (getRoomErr) {
                    return db.rollback(() => {
                        console.error(getRoomErr);
                        return res.status(500).json({ success: false, message: 'Lỗi khi lấy thông tin phòng' });
                    });
                }

                if (!roomRows || roomRows.length === 0) {
                    return db.rollback(() => {
                        return res.status(404).json({ success: false, message: 'Phòng không tồn tại' });
                    });
                }

                const SoNguoi = roomRows[0].SoNguoi;

                // Bước 2: Đếm số hợp đồng hiện tại của phòng (chỉ tính hợp đồng đang hoạt động)
                db.query('SELECT COUNT(*) as soHopDong FROM hopdong WHERE MaPhong = ? AND TrangThai = 1', [MaPhong], (countErr, countRows) => {
                    if (countErr) {
                        return db.rollback(() => {
                            console.error(countErr);
                            return res.status(500).json({ success: false, message: 'Lỗi khi đếm hợp đồng' });
                        });
                    }

                    const soHopDongHienTai = countRows[0].soHopDong;

                    // Bước 3: Kiểm tra nếu đã đạt số người tối đa
                    if (soHopDongHienTai >= SoNguoi) {
                        return db.rollback(() => {
                            return res.status(400).json({ 
                                success: false, 
                                message: `Phòng này đã đầy. Số người tối đa: ${SoNguoi}, số hợp đồng hiện tại: ${soHopDongHienTai}` 
                            });
                        });
                    }

                    // Bước 4: Tạo hợp đồng
                    db.query(
                        'INSERT INTO hopdong (MaPhong, MaKH, NgayTao, NgayKT, TienCoc, TrangThai) VALUES (?, ?, ?, ?, ?, ?)',
                        [MaPhong, MaKH, ngayTaoValue, NgayKT || null, TienCoc || 0, TrangThai || 0],
                        (insertErr, result) => {
                            if (insertErr) {
                                return db.rollback(() => {
                                    console.error(insertErr);
                                    return res.status(500).json({ success: false, message: 'Lỗi khi tạo hợp đồng' });
                                });
                            }

                            // Bước 5: Đếm lại số hợp đồng sau khi tạo
                            db.query('SELECT COUNT(*) as soHopDong FROM hopdong WHERE MaPhong = ? AND TrangThai = 1', [MaPhong], (reCountErr, reCountRows) => {
                                if (reCountErr) {
                                    return db.rollback(() => {
                                        console.error(reCountErr);
                                        return res.status(500).json({ success: false, message: 'Lỗi khi đếm lại hợp đồng' });
                                    });
                                }

                                const soHopDongSauTao = reCountRows[0].soHopDong;
                                let shouldUpdateRoom = false;

                                // Bước 6: Nếu số hợp đồng = SoNguoi thì cập nhật TinhTrang = 1
                                if (soHopDongSauTao >= SoNguoi) {
                                    shouldUpdateRoom = true;

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
                                                    message: 'Tạo hợp đồng thành công. Phòng đã đầy.',
                                                    data: { MaHD: result.insertId, MaPhong, MaKH, NgayTao: ngayTaoValue, NgayKT, TienCoc, TrangThai }
                                                });
                                            });
                                        }
                                    );
                                } else {
                                    // Không cập nhật trạng thái phòng, chỉ commit transaction
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
                                            data: { MaHD: result.insertId, MaPhong, MaKH, NgayTao: ngayTaoValue, NgayKT, TienCoc, TrangThai }
                                        });
                                    });
                                }
                            });
                        }
                    );
                });
            });
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