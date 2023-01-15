const { Router } = require("express");
const {
	themnpp,
	laytatcanpp,
	laymotnpp,
	suamotnpp,
	xoamotnpp,
} = require("~/controllers/nhaphanphoi.controller");

const router = Router();

router.route("/").post(themnpp).get(laytatcanpp);
router
	.route("/:ma")
	.get(laymotnpp)
	.put(suamotnpp)
	.delete(xoamotnpp);
module.exports = router;
