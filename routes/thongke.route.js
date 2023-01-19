const { Router } = require("express");
const {
	thongke,
	thongkeloaihangnhap,
	thongkeloaihangban,
	thongkeTheoNgay,
} = require("~/controllers/thongke.controller");

const router = Router();

router.route("/").get(thongke);
router.get("/loaihangnhap").get(thongkeloaihangnhap);
router.get("/loaihangban").get(thongkeloaihangban);
router.route("/ngay").get(thongkeTheoNgay);

module.exports = router;
