const { Router } = require("express");
const {
	laytatcaphieuxuat,
	taophieuxuat,
	suaphieuxuat,
	xoaphieuxuat,
	layphieuxuat,
	themloaihangvaophieu,
	luuphieuxuat,
} = require("~/controllers/xuathang.controller");
const router = Router();

router.route("/").get(laytatcaphieuxuat).post(taophieuxuat);
router
	.route("/:ma")
	.put(suaphieuxuat)
	.delete(xoaphieuxuat)
	.get(layphieuxuat);
router.route("/:ma/loaihang").post(themloaihangvaophieu);
router.route("/:ma/luu").get(luuphieuxuat);

module.exports = router;
