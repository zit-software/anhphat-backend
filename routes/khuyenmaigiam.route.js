const { Router } = require("express");
const {
	taokhuyenmai,
	laytatca,
	chinhsua,
	xoa,
	getKhuyenmaigiam,
} = require("~/controllers/khuyenmaigiam.controller");
const AdminMiddleware = require("~/middleware/admin.middleware");

const router = Router();

router
	.route("/:ma")
	.put(chinhsua)
	.delete(AdminMiddleware, xoa)
	.get(getKhuyenmaigiam);

router.route("/").post(taokhuyenmai).get(laytatca);

module.exports = router;
