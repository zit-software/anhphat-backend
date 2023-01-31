const { Router } = require("express");
const {
	themquycach,
	laytatcaquycach,
	updateQuyCach,
	laymotquycach,
	xoaQuyCach,
} = require("~/controllers/quycach.controller");
const router = Router();

router.route("/").post(themquycach).get(laytatcaquycach);
router.route("/laymot").get(laymotquycach);
router.route("/:ma").put(updateQuyCach).delete(xoaQuyCach);
module.exports = router;
