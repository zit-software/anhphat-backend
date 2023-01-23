const { Router } = require("express");
const {
	themnpp,
	laytatcanpp,
	laymotnpp,
	suamotnpp,
	xoamotnpp,
	capnhatdiem,
	getAllLogDiem,
} = require("~/controllers/nhaphanphoi.controller");

const router = Router();
router.route("/diem").get(getAllLogDiem);
router.route("/diem/:ma").put(capnhatdiem);
router.route("/").post(themnpp).get(laytatcanpp);
router
	.route("/:ma")
	.get(laymotnpp)
	.put(suamotnpp)
	.delete(xoamotnpp);

module.exports = router;
