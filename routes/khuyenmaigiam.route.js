const { Router } = require("express");
const {
	taokhuyenmai,
	laytatca,
	chinhsua,
	xoa,
	getKhuyenmaigiam,
} = require("~/controllers/khuyenmaigiam.controller");

const router = Router();

router
	.route("/:ma")
	.put(chinhsua)
	.delete(xoa)
	.get(getKhuyenmaigiam);

router.route("/").post(taokhuyenmai).get(laytatca);

module.exports = router;
