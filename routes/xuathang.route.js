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

router
	.route("/phieuxuat")
	.get(laytatcaphieuxuat)
	.post(taophieuxuat);
router
	.route("/phieuxuat/:ma")
	.put(suaphieuxuat)
	.delete(xoaphieuxuat)
	.get(layphieuxuat);
router
	.route("/phieuxuat/:ma/loaihang")
	.post(themloaihangvaophieu);
router.route("/phieuxuat/:ma/luu").get(luuphieuxuat);

module.exports = router;
