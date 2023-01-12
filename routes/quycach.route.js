const { Router } = require("express");
const {
	themquycach,
	laytatcaquycach,
	updateQuyCach,
} = require("~/controllers/quycach.controller");
const router = Router();

router.route("/").post(themquycach).get(laytatcaquycach);
router.route("/:ma").put(updateQuyCach);
module.exports = router;
