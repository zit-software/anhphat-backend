const { Router } = require("express");
const {
	thongke,
	thongkeloaihangnhap,
	thongkeloaihangban,
} = require("~/controllers/thongke.controller");

const router = Router();

router.route("/").get(thongke);
router.get("/loaihangnhap").get(thongkeloaihangnhap);
router.get("/loaihangban").get(thongkeloaihangban);

module.exports = router;
