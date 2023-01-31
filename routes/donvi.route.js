const { Router } = require("express");
const {
	laytatcadonvi,
	taodonvi,
	xoatatcadonvi,
	suadonvi,
	xoadonvi,
} = require("~/controllers/donvi.controller");
const AdminMiddleware = require("~/middleware/admin.middleware");
const router = Router();

router
	.route("/")
	.get(laytatcadonvi)
	.post(AdminMiddleware, taodonvi)
	.delete(AdminMiddleware, xoatatcadonvi);

router
	.route("/:ma")
	.put(AdminMiddleware, suadonvi)
	.delete(AdminMiddleware, xoadonvi);

module.exports = router;
