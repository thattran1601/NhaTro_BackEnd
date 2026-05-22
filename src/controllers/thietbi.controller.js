const db=require("../config/db");  

exports.getAllThietBi=async(req,res)=>{
    db.query("select t.MaTB, tb.MaPhong, t.TenTB, t.SoSeri, tb.TinhTrang from thietbi t left join thietbiphong tb on t.MaTB=tb.MaTB",(err,result)=>{
        if(err)
            {
                console.error("Lỗi truy vấn cơ sở dữ liệu:", err);
                res.status(500).json({ error: "Lỗi truy vấn cơ sở dữ liệu" });
            }
        else
            {
                res.json(result);
            }   
    });
};
exports.getAllThietBiByPhongId=async(req,res)=>{
    db.query("select t.MaPhong, t.MaTb, tb.TenTB,t.TinhTrang from thietbiphong t join thietbi tb on t.MaTB=tb.MaTB where t.MaPhong=?",[req.params.id],(err,result)=>{
        if(err)
            {
                console.error("Lỗi truy vấn cơ sở dữ liệu:", err);
                res.status(500).json({ error: "Lỗi truy vấn cơ sở dữ liệu" });
            }
        else
            {
                res.json(result);
            }
    });
};
exports.createThietBi=(req,res)=>{
    const {TenTB,SoSeri}=req.body;
    const TinhTrang=0;
    db.query("insert into thietbi(TenTB,SoSeri) values(?,?)",[TenTB,SoSeri],(err,result)=>{
        if(err)
            {
                console.error("Lỗi truy vấn cơ sở dữ liệu:", err);
                res.status(500).json({ error: "Lỗi truy vấn cơ sở dữ liệu" });
            }
        else
            {
                res.json({message:"Tạo thiết bị thành công"});
            }   
    });
};  
exports.updateThietBi = (req, res) => {
    const { TenTB, SoSeri, TinhTrang, MaPhong } = req.body;
    const { id } = req.params;

    if (!TenTB || !SoSeri) {
        return res.status(400).json({
            error: "Thiếu tên thiết bị hoặc số seri"
        });
    }

    const updateSql = `
        UPDATE thietbi
        SET TenTB = ?, SoSeri = ?
        WHERE MaTB = ?
    `;

    db.query(updateSql, [TenTB, SoSeri, id], (err, result) => {

        if (err) {
            console.error(err);
            return res.status(500).json({
                error: "Lỗi cập nhật thiết bị"
            });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({
                error: "Không tìm thấy thiết bị"
            });
        }

        // nếu có phòng thì cập nhật tình trạng
        if (MaPhong && TinhTrang !== undefined) {

            const updateTinhTrangSql = `
                UPDATE thietbiphong
                SET TinhTrang = ?
                WHERE MaPhong = ? AND MaTB = ?
            `;

            db.query(updateTinhTrangSql, [TinhTrang, MaPhong, id], (err2) => {

                if (err2) {
                    console.error(err2);
                    return res.status(500).json({
                        error: "Lỗi cập nhật tình trạng thiết bị"
                    });
                }

                res.json({
                    message: "Cập nhật thiết bị thành công"
                });
            });

        }
        else {

            res.json({
                message: "Cập nhật thiết bị thành công"
            });

        }

    });
};
exports.deleteThietBi = (req, res) => {

    db.query(
        "SELECT * FROM thietbiphong WHERE MaTB = ?",
        [req.params.id],
        (checkErr, checkResult) => {

            if (checkErr) {

                console.error("Lỗi kiểm tra thiết bị:", checkErr);

                return res.status(500).json({
                    error: "Lỗi kiểm tra dữ liệu"
                });
            }

            if (checkResult.length > 0) {

                return res.status(400).json({
                    error: "Thiết bị đang được gán cho phòng, không thể xóa"
                });
            }

            db.query(
                "DELETE FROM thietbi WHERE MaTB = ?",
                [req.params.id],
                (err, result) => {

                    if (err) {

                        console.error("Lỗi truy vấn cơ sở dữ liệu:", err);

                        return res.status(500).json({
                            error: "Không thể xóa thiết bị"
                        });
                    }

                    if (result.affectedRows === 0) {

                        return res.status(404).json({
                            error: "Không tìm thấy thiết bị"
                        });
                    }

                    res.json({
                        message: "Xóa thiết bị thành công"
                    });

                }
            );

        }
    );

};
exports.addThietBiToPhong = (req, res) => {
    const { MaPhong, MaTB } = req.body;
    const TinhTrang = 0;

    if (!MaPhong || !MaTB) {
        return res.status(400).json({
            error: "Thiếu dữ liệu"
        });
    }

    const checkSql = `
        SELECT * FROM thietbiphong
        WHERE MaTB = ? AND MaPhong IS NOT NULL
    `;

    db.query(checkSql, [MaTB], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({
                error: "Lỗi kiểm tra dữ liệu"
            });
        }
        if (result.length > 0) {
            return res.status(400).json({
                message: "Thiết bị đã được gán cho phòng khác"
            });
        }
        const insertSql = `
            INSERT INTO thietbiphong (MaPhong, MaTB, TinhTrang)
            VALUES (?, ?, ?)
        `;

        db.query(insertSql, [MaPhong, MaTB, TinhTrang], (err, data) => {
            if (err) {
                console.error(err);
                return res.status(500).json({
                    error: "Lỗi thêm dữ liệu"
                });
            }

            res.json({
                message: "Thêm thiết bị vào phòng thành công"
            });
        });
    });
};
exports.removeThietBiFromPhong = (req, res) => {
    const { MaPhong, MaTB } = req.body;
    if (!MaPhong || !MaTB) {
        return res.status(400).json({
            error: "Thiếu dữ liệu"
        });
    }
    const deleteSql = `
        DELETE FROM thietbiphong
        WHERE MaPhong = ? AND MaTB = ?
    `;
    db.query(deleteSql, [MaPhong, MaTB], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({
                error: "Lỗi xóa dữ liệu"
            });
        }   
        res.json({
            message: "Xóa thiết bị khỏi phòng thành công"
        });
    });
};

