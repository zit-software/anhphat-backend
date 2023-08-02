const {
	taophieunhap,
	getAllPhieuNhapQuaKD,
	deletePhieuNhapQuaKD,
} = require("~/controllers/phieunhapquakd.controller");
const {
	taoPhieuXuatQuaKD,
	getAllPhieuXuatQuaKD,
} = require("~/controllers/phieuxuatquakd.controller");
const {
	layTatCaQuaKhuyenDung,
	taoQuaKhuyenDung,
	xoaQuaKhuyenDung,
	suaQuaKhuyenDung,
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
router
	.route("/:ma")
	.delete(xoaQuaKhuyenDung)
	.put(suaQuaKhuyenDung);

router
	.route("/xuat")
	.post(taoPhieuXuatQuaKD)
	.get(getAllPhieuXuatQuaKD);
module.exports = router;
