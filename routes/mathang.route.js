const { Router } = require("express");

const {
	themmathang,
	laytatcamathang,
	chinhsuamathang,
	xoamathang,
	laymotmathang,
	laySoLuong,
	layMotMathang,
	phanra,
	laymathangSapHetHan,
	layloaihangSapHet,
	demSoLuongKho,
} = require("~/controllers/mathang.controller");

const router = Router();

router
	.route("/")
	.post(themmathang)
	.get(laytatcamathang)
	.get(laymotmathang);
router.route("/saphethan").get(laymathangSapHetHan);
router.route("/saphet").get(layloaihangSapHet);
router.route("/soluong-kho").get(demSoLuongKho);

router
	.route("/:ma")
	.get(layMotMathang)
	.put(chinhsuamathang)
	.delete(xoamathang);
router.route("/soluong/:madv").get(laySoLuong);
router.route("/phanra/:ma").post(phanra);

module.exports = router;
