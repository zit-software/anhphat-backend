const { Router } = require("express");
const {
	thongke,
	thongkeloaihangnhap,
	thongkeloaihangban,
	thongkeTheoNgay,
	thongkeTheoTinh,
} = require("~/controllers/thongke.controller");

const router = Router();

router.route("/").get(thongke);
router.get("/loaihangnhap", thongkeloaihangnhap);
router.get("/loaihangban", thongkeloaihangban);
router.get("/tinh", thongkeTheoTinh);
router.route("/ngay").get(thongkeTheoNgay);

module.exports = router;
