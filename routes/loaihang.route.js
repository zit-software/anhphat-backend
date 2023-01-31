const { Router } = require("express");
const {
	themloaihang,
	laytatcaloaihang,
	xoatatcaloaihang,
	layloaihang,
	sualoaihang,
	xoaloaihang,
} = require("~/controllers/loaihang.controller");
const AdminMiddleware = require("~/middleware/admin.middleware");
const router = Router();
router
	.route("/")
	.post(AdminMiddleware, themloaihang)
	.get(laytatcaloaihang)
	.delete(AdminMiddleware, xoatatcaloaihang);

router
	.route("/:ma")
	.get(layloaihang)
	.put(AdminMiddleware, sualoaihang)
	.delete(AdminMiddleware, xoaloaihang);

module.exports = router;
