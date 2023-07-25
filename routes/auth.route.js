const { Router } = require("express");

const AuthController = require("~/controllers/auth.controller");
const AuthMiddleware = require("~/middleware/auth.middleware");

const router = Router();

router.get(
	"/",
	AuthMiddleware,
	AuthController.xacthucnguoidung,
);
router.post("/login", AuthController.dangnhap);
router.post(
	"/pin",
	AuthMiddleware,
	AuthController.kiemtrapin,
);

module.exports = router;
