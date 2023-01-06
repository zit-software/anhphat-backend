const { Router } = require("express");

const {
	themmathang,
	laytatcamathang,
	chinhsuamathang,
	xoamathang,
} = require("~/controllers/mathang.controller");

const router = Router();

router.route("/").post(themmathang).get(laytatcamathang);

router
	.route("/:ma")
	.put(chinhsuamathang)
	.delete(xoamathang);

module.exports = router;
