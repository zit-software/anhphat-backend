const { Router } = require("express");
const {
	thongke,
	thongkeloaihangnhap,
	thongkeloaihangban,
	thongkeTheoNgay,
	thongkeTheoTinh,
	thongkeTheoMotTinh,
	getAllTinh,
	recheckThongKeByPhieu,
} = require("~/controllers/thongke.controller");
const AdminMiddleware = require("~/middleware/admin.middleware");

const router = Router();

router.route("/").get(thongke);
router.get("/loaihangnhap", thongkeloaihangnhap);
router.get("/loaihangban", thongkeloaihangban);
router.get("/alltinh", getAllTinh);
router.get("/tinh", thongkeTheoTinh);
router.get("/tinh/:matinh", thongkeTheoMotTinh);
router.route("/ngay").get(thongkeTheoNgay);
router
	.route("/re-check")
	.post(AdminMiddleware, recheckThongKeByPhieu);

module.exports = router;
