const express=require("express");
const router=express.Router();
const phongController=require("../controllers/phong.controller");
router.get("/",phongController.getAllPhong);
router.get("/:id",phongController.getAllPhongByIdNhaTro);
router.post("/",phongController.createPhong);
router.put("/:id",phongController.updatePhong);
router.delete("/:id",phongController.deletePhong);
module.exports=router;