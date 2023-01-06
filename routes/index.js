const { Router } = require("express");

const AdminMiddleware = require("~/middleware/admin.middleware");
const AuthMiddleware = require("~/middleware/auth.moddleware");

const router = Router();

router.use("/auth", require("./auth.route"));

router.use(
	"/quantri",
	AuthMiddleware,
	AdminMiddleware,
	require("./quantri.route")
);

router.use(
	"/mathang",
	AuthMiddleware,
	require("./mathang.route")
);

router.use(
	"/nhaphang",
	AuthMiddleware,
	require("./nhaphang.route")
);

router.use(
	"/khuyenmagiam",
	AuthMiddleware,
	AdminMiddleware,
	require("./khuyenmaigiam.route")
);

router.use(
	"/khuyenmaitang",
	AuthMiddleware,
	AdminMiddleware,
	require("./khuyenmaitang.route")
);

router.use(
	"/thongke",
	AuthMiddleware,
	AdminMiddleware,
	require("./thongke.route")
);

module.exports = router;
