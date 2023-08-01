const {
	taophieunhap,
	getAllPhieuNhapQuaKD,
	deletePhieuNhapQuaKD,
} = require("~/controllers/phieunhapquakd.controller");
const {
	layTatCaQuaKhuyenDung,
	taoQuaKhuyenDung,
} = require("~/controllers/quakhuyendung.controller");

const router = require("express").Router();

router
	.route("/")
	.get(layTatCaQuaKhuyenDung)
	.post(taoQuaKhuyenDung);

router
	.route("/nhap")
	.post(taophieunhap)
	.get(getAllPhieuNhapQuaKD);
router.route("/nhap/:ma").delete(deletePhieuNhapQuaKD);
module.exports = router;
