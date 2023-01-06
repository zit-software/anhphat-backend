const { Router } = require("express");
const {
	taokhuyenmai,
	laytatca,
	chinhsua,
	xoa,
} = require("~/controllers/khuyenmaitang.controller");

const router = Router();

router.route("/").post(taokhuyenmai).get(laytatca);

router.route("/:ma").put(chinhsua).delete(xoa);

module.exports = router;
