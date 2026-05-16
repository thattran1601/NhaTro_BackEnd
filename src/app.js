const express=require("express");
const cors=require("cors");
const app=express();
const phongRoutes=require("./routes/phong.routes");
const thietbiRoutes=require("./routes/thietbi.routes");
const hopdongRoutes=require("./routes/hopdong.routes");
const khachhangRoutes=require("./routes/khachhang.routes");
const thanNhanRoutes=require("./routes/thannhan.routes");

app.use(cors());
app.use(express.json());
app.get("/",(req,res)=>{
    res.json({message:"Backend đang hoạt động tốt!"});
});
app.use("/api/phong",phongRoutes);
app.use("/api/thietbi",thietbiRoutes);
app.use("/api/hopdong",hopdongRoutes);
app.use("/api/khachhang",khachhangRoutes);
app.use("/api/thannhan",thanNhanRoutes);

module.exports=app;