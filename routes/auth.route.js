const { Router } = require("express");
const AuthController = require("~/controllers/auth.controller");

const router = Router();
router.get("/", AuthController.xacthucnguoidung);
router.post("/login", AuthController.dangnhap);
module.exports = router;
