const { Router } = require("express");
const {
	laytatcaphieuxuat,
	taophieuxuat,
	suaphieuxuat,
	xoaphieuxuat,
	layphieuxuat,
	themloaihangvaophieu,
	luuphieuxuat,
	taophieuxuatAuto,
	taophieuxuatManual,
} = require("~/controllers/xuathang.controller");
const router = Router();

router
	.route("/phieuxuat")
	.get(laytatcaphieuxuat)
	.post(taophieuxuat);
router.post("/phieuxuat/auto/:ma", taophieuxuatAuto);
router.post("/phieuxuat/manual/:ma", taophieuxuatManual);
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
