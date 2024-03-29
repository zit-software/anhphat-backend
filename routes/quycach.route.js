const { Router } = require("express");
const {
	themquycach,
	laytatcaquycach,
	updateQuyCach,
	laymotquycach,
	xoaQuyCach,
} = require("~/controllers/quycach.controller");
const AdminMiddleware = require("~/middleware/admin.middleware");
const router = Router();

router
	.route("/")
	.post(AdminMiddleware, themquycach)
	.get(laytatcaquycach);

router.route("/laymot").get(laymotquycach);
router
	.route("/:ma")
	.put(AdminMiddleware, updateQuyCach)
	.delete(xoaQuyCach);
module.exports = router;
