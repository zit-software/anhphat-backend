const { Router } = require("express");
const {
	themquycach,
	laytatcaquycach,
} = require("~/controllers/quycach.controller");
const router = Router();

router.route("/").post(themquycach).get(laytatcaquycach);
module.exports = router;
