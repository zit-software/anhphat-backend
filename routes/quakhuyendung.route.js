const {
	layTatCaQuaKhuyenDung,
} = require("~/controllers/quakhuyendung.controller");

const router = require("express").Router();

router.route("/").get(layTatCaQuaKhuyenDung);

module.exports = router;
