const db=require("../config/db");

exports.getAllPhong=async(req,res)=>{
    db.query("select * from phong",(err,result)=>{
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
}
exports.getAllPhongByIdNhaTro=async(req,res)=>{
    db.query("select * from phong where MaPhong=?", [req.params.id], (err,result)=>{
        if(err)
            {
                console.error("Lỗi truy vấn cơ sở dữ liệu:", err);
                res.status(500).json({ error: "Lỗi truy vấn cơ sở dữ liệu" });
            }
        else
            {
                res.json(result[0]);
            }
    });
};
exports.createPhong=(req,res)=>{
    const {TenPhong,GiaThue,SoNguoi,DanhSachThietBi}=req.body;
    const TinhTrang=0;
    db.query("insert into phong(TenPhong,GiaThue,SoNguoi) values(?,?,?)",[TenPhong,GiaThue,SoNguoi],(err,result)=>{
        if(err)
            {
                console.error("Lỗi truy vấn cơ sở dữ liệu:", err);
                res.status(500).json({ error: "Lỗi truy vấn cơ sở dữ liệu" });
            }
        else
            {
                res.json({message:"Tạo phòng thành công"});
            }
         
    });
    const MaPhong = result.insertId;
    if(!DanhSachThietBi || DanhSachThietBi.length === 0) {
        return res.json({ message: "Tạo phòng thành công, không có thiết bị nào được thêm vào phòng" });
    }
    DanhSachThietBi.forEach(MaTB => {
        db.query("insert into thietbiphong(MaPhong, MaTB, TinhTrang) values(?, ?, ?)", [MaPhong, MaTB, 0], (err) => {
            if (err) {
                console.error("Lỗi thêm thiết bị vào phòng:", err);
            }

        });

    });
    res.json({ message: "Tạo phòng thành công và thêm thiết bị vào phòng" 
       
    });
};
exports.updatePhong=(req,res)=>{
    const {TenPhong,GiaThue,TinhTrang}=req.body;
    db.query("update phong set TenPhong=?,GiaThue=?,TinhTrang=? where MaPhong=?",[TenPhong,GiaThue,TinhTrang,req.params.id],(err,result)=>{
        if(err)
            {
                console.error("Lỗi truy vấn cơ sở dữ liệu:", err);
                res.status(500).json({ error: "Lỗi truy vấn cơ sở dữ liệu" });
            }
        else
            {
                res.json({message:"Cập nhật phòng thành công"});
            }
    });

}
exports.deletePhong=(req,res)=>{
    db.query("delete from phong where MaPhong=?",[req.params.id],(err)=>{
        if(err)
            {
                console.error("Lỗi truy vấn cơ sở dữ liệu:", err);
                res.status(500).json({ error: "Lỗi truy vấn cơ sở dữ liệu" });
            }
        else
            {
                res.json({message:"Xóa phòng thành công"});
            }   
    });
}
exports.ChitietPhong = (req, res) => {
    db.query(
        `SELECT 
            p.MaPhong,
            p.TenPhong,
            p.TinhTrang AS TinhTrangPhong,
            kh.HoTen AS TenKhachHang,
            kh.SDT,
            tb.TenTB AS TenThietBi,
            tb.SoSeri,
            tbp.TinhTrang AS TinhTrangThietBi 
        FROM phong p 
        LEFT JOIN hopdong hd ON p.MaPhong = hd.MaPhong 
        LEFT JOIN khachhang kh ON hd.MaKH = kh.MaKH 
        LEFT JOIN thietbiphong tbp ON p.MaPhong = tbp.MaPhong 
        LEFT JOIN thietbi tb ON tbp.MaTB = tb.MaTB 
        WHERE p.MaPhong = ?`,
        [req.params.id],
        (err, result) => {
            if (err) {
                console.error("Lỗi truy vấn cơ sở dữ liệu:", err);
                return res.status(500).json({ error: "Lỗi truy vấn cơ sở dữ liệu" });
            }

            if (result.length === 0) {
                return res.status(404).json({ error: "Không tìm thấy phòng" });
            }

            res.json(result);
        }
    );
};