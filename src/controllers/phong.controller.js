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
    const {TenPhong,GiaThue}=req.body;
    const TinhTrang=0;
    db.query("insert into phong(TenPhong,GiaThue) values(?,?)",[TenPhong,GiaThue],(err,result)=>{
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