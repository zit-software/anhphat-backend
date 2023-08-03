const {
	taophieunhap,
	getAllPhieuNhapQuaKD,
	deletePhieuNhapQuaKD,
	getOne,
} = require("~/controllers/phieunhapquakd.controller");
const {
	taoPhieuXuatQuaKD,
	getAllPhieuXuatQuaKD,
	xoaPhieuXuatQuaKD,
	getOnePhieuXuatQua,
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
router
	.route("/nhap/:ma")
	.delete(deletePhieuNhapQuaKD)
	.get(getOne);
router
	.route("/:ma")
	.delete(xoaQuaKhuyenDung)
	.put(suaQuaKhuyenDung);

router
	.route("/xuat")
	.post(taoPhieuXuatQuaKD)
	.get(getAllPhieuXuatQuaKD);
router
	.route("/xuat/:ma")
	.delete(xoaPhieuXuatQuaKD)
	.get(getOnePhieuXuatQua);
module.exports = router;
