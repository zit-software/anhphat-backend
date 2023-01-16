const { Router } = require("express");
const {
	taokhuyenmai,
	laytatca,
	chinhsua,
	xoa,
	themchitiet,
	chinhsuachitiet,
	laymotkhuyenmai,
} = require("~/controllers/khuyenmaitang.controller");

const router = Router();

router.route("/").post(taokhuyenmai).get(laytatca);

router
	.route("/:ma")
	.put(chinhsua)
	.delete(xoa)
	.get(laymotkhuyenmai);
router
	.route("/chitiet/:ma")
	.post(themchitiet)
	.put(chinhsuachitiet);

module.exports = router;
