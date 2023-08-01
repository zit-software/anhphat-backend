const {
	layTatCaQuaKhuyenDung,
	taoQuaKhuyenDung,
} = require("~/controllers/quakhuyendung.controller");

const router = require("express").Router();

router
	.route("/")
	.get(layTatCaQuaKhuyenDung)
	.post(taoQuaKhuyenDung);

module.exports = router;
