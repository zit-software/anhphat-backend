const { Router } = require("express");
const {
	laytatcataikhoan,
	laytaikhoan,
	suataikhoan,
	themtaikhoan,
	xoataikhoan,
} = require("~/controllers/quantri.controller");

const router = Router();

router
	.route("/taikhoan")
	.post(themtaikhoan)
	.get(laytatcataikhoan);

router
	.route("/taikhoan/:ma")
	.get(laytaikhoan)
	.put(suataikhoan)
	.delete(xoataikhoan);

module.exports = router;
