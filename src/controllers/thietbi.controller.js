const db=require("../config/db");  

exports.getAllThietBi=async(req,res)=>{
    db.query("select t.MaTB, tb.MaPhong, t.TenTB, t.SoSeri, tb.TinhTrang from thietbi t join thietbiphong tb on t.MaTB=tb.MaTB",(err,result)=>{
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
exports.updateThietBi=(req,res)=>{
    const {TenTB,SoSeri,TinhTrang}=req.body;
    db.query("update thietbi set TenTb=?,SoSeri=?,TinhTrang=? where MaTB=?",[TenTB,SoSeri,TinhTrang,req.params.id],(err,result)=>{
        if(err)
            {
                console.error("Lỗi truy vấn cơ sở dữ liệu:", err);
                res.status(500).json({ error: "Lỗi truy vấn cơ sở dữ liệu" });
            }
        else
            {
                res.json({message:"Cập nhật thiết bị thành công"});
            }
    });
};
exports.deleteThietBi=(req,res)=>{
    db.query("delete from thietbi Where MaTB=?",[req.params.id],(err)=>{
        if(err)
            {
                console.error("Lỗi truy vấn cơ sở dữ liệu:", err);
                res.status(500).json({ error: "Lỗi truy vấn cơ sở dữ liệu" });
            }
        else
            {
                res.json({message:"Xóa thiết bị thành công"});
            }   
    });
};
exports.addThietBiToPhong=(req,res)=>{
    const {MaPhong,MaTB}=req.body;  
    const TinhTrang=0;

    db.query("insert into thietbiphong(MaPhong,MaTB,TinhTrang) values(?,?,?)",[MaPhong,MaTB,TinhTrang],(err,result)=>{
        if(err)
            {
                console.error("Lỗi truy vấn cơ sở dữ liệu:", err);
                res.status(500).json({ error: "Lỗi truy vấn cơ sở dữ liệu" });
            }
        else
            {
                res.json({message:"Thêm thiết bị vào phòng thành công"});
            }
    });
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