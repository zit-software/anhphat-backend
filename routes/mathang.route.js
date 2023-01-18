const { Router } = require("express");

const {
	themmathang,
	laytatcamathang,
	chinhsuamathang,
	xoamathang,
	laymotmathang,
} = require("~/controllers/mathang.controller");

const router = Router();

router
	.route("/")
	.post(themmathang)
	.get(laytatcamathang)
	.get(laymotmathang);

router
	.route("/:ma")
	.put(chinhsuamathang)
	.delete(xoamathang);

module.exports = router;
