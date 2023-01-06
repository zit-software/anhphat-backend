const { Router } = require("express");
const {
	laytatcataikhoan,
	laytaikhoan,
	suataikhoan,
	themtaikhoan,
	xoataikhoan,
} = require("~/controllers/quantri.controller");

const router = Router();

router.route("/").post(themtaikhoan).get(laytatcataikhoan);

router
	.route("/:ma")
	.get(laytaikhoan)
	.put(suataikhoan)
	.delete(xoataikhoan);

module.exports = router;
