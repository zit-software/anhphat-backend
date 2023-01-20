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
} = require("~/controllers/mathang.controller");

const router = Router();

router
	.route("/")
	.post(themmathang)
	.get(laytatcamathang)
	.get(laymotmathang);

router
	.route("/:ma")
	.get(layMotMathang)
	.put(chinhsuamathang)
	.delete(xoamathang);

router.route("/soluong/:madv").get(laySoLuong);
router.route("/phanra/:ma").post(phanra);

module.exports = router;
