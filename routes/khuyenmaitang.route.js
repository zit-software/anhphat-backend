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
const AdminMiddleware = require("~/middleware/admin.middleware");

const router = Router();

router.route("/").post(taokhuyenmai).get(laytatca);

router
	.route("/:ma")
	.put(chinhsua)
	.delete(AdminMiddleware, xoa)
	.get(laymotkhuyenmai);
router
	.route("/chitiet/:ma")
	.post(themchitiet)
	.put(chinhsuachitiet);

module.exports = router;
