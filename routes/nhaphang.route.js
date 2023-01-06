const { Router } = require("express");
const {
	taophieunhap,
	laytatcaphieunhap,
	xoaphieunhap,
	laymotphieunhap,
	chinhsuaphieunhap,
} = require("~/controllers/nhaphang.controller");

const router = Router();

router
	.route("/phieunhap")
	.post(taophieunhap)
	.get(laytatcaphieunhap);

router
	.route("/phieunhap/:ma")
	.delete(xoaphieunhap)
	.get(laymotphieunhap)
	.put(chinhsuaphieunhap);

module.exports = router;
