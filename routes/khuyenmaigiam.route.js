const { Router } = require("express");
const {
	taokhuyenmai,
	laytatca,
	chinhsua,
	xoa,
} = require("~/controllers/khuyenmaigiam.controller");

const router = Router();

router.route("/:ma").put(chinhsua).delete(xoa);

router.route("/").post(taokhuyenmai).get(laytatca);

module.exports = router;
