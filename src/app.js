const express=require("express");
const cors=require("cors");
const app=express();
const phongRoutes=require("./routes/phong.routes");
const thietbiRoutes=require("./routes/thietbi.routes");

app.use(cors());
app.use(express.json());
app.get("/",(req,res)=>{
    res.json({message:"Backend đang hoạt động tốt!"});
});
app.use("/api/phong",phongRoutes);
app.use("/api/thietbi",thietbiRoutes);

module.exports=app;