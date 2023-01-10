const { Router } = require("express");
const {
	laytatcadonvi,
	taodonvi,
	xoatatcadonvi,
	suadonvi,
	xoadonvi,
} = require("~/controllers/donvi.controller");
const router = Router();

router
	.route("/")
	.get(laytatcadonvi)
	.post(taodonvi)
	.delete(xoatatcadonvi);

router.route("/:ma").put(suadonvi).delete(xoadonvi);

module.exports = router;
