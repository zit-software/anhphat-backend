const { Router } = require("express");
const {
	thongke,
} = require("~/controllers/thongke.controller");

const router = Router();

router.route("/").get(thongke);

module.exports = router;
