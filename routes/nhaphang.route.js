const { Router } = require("express");
const {
	taophieunhap,
	laytatcaphieunhap,
	xoaphieunhap,
	laymotphieunhap,
	chinhsuaphieunhap,
	themsanpham,
} = require("~/controllers/nhaphang.controller");

const router = Router();

router
	.route("/phieunhap")
	.post(taophieunhap)
	.get(laytatcaphieunhap);

router.post("/phieunhap/themsp", themsanpham);

router
	.route("/phieunhap/:ma")
	.delete(xoaphieunhap)
	.get(laymotphieunhap)
	.put(chinhsuaphieunhap);

module.exports = router;
