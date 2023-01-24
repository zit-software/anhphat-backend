const { Router } = require("express");
const {
	thongke,
	thongkeloaihangnhap,
	thongkeloaihangban,
	thongkeTheoNgay,
	thongkeTheoTinh,
	thongkeTheoMotTinh,
	getAllTinh,
} = require("~/controllers/thongke.controller");

const router = Router();

router.route("/").get(thongke);
router.get("/loaihangnhap", thongkeloaihangnhap);
router.get("/loaihangban", thongkeloaihangban);
router.get("/alltinh", getAllTinh);
router.get("/tinh", thongkeTheoTinh);
router.get("/tinh/:matinh", thongkeTheoMotTinh);
router.route("/ngay").get(thongkeTheoNgay);

module.exports = router;
