const { Router } = require("express");
const {
	themloaihang,
	laytatcaloaihang,
	xoatatcaloaihang,
	layloaihang,
	sualoaihang,
	xoaloaihang,
} = require("~/controllers/loaihang.controller");
const router = Router();
router
	.route("/")
	.post(themloaihang)
	.get(laytatcaloaihang)
	.delete(xoatatcaloaihang);
router
	.route("/:ma")
	.get(layloaihang)
	.put(sualoaihang)
	.delete(xoaloaihang);

module.exports = router;
