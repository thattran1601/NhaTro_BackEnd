const express=require('express');
const router=express.Router();
const thietbiController=require("../controllers/thietbi.controller");

router.get("/", thietbiController.getAllThietBi);
router.get("/phong/:id", thietbiController.getAllThietBiByPhongId);
router.post("/", thietbiController.createThietBi);
router.put("/:id", thietbiController.updateThietBi);
router.delete("/:id", thietbiController.deleteThietBi);
router.post("/them-thiet-bi", thietbiController.addThietBiToPhong);
router.delete("/xoa-thiet-bi", thietbiController.removeThietBiFromPhong);
module.exports=router;