const { Router } = require("express");

const AdminMiddleware = require("~/middleware/admin.middleware");
const AuthMiddleware = require("~/middleware/auth.middleware");

const router = Router();

router.use("/auth", require("./auth.route"));

router.use(
	"/quantri",
	AuthMiddleware,
	AdminMiddleware,
	require("./quantri.route")
);

router.use(
	"/loaihang",
	AuthMiddleware,
	AdminMiddleware,
	require("./loaihang.route")
);

router.use(
	"/donvi",
	AuthMiddleware,
	AdminMiddleware,
	require("./donvi.route")
);
router.use(
	"/quycach",
	AuthMiddleware,
	AdminMiddleware,
	require("./quycach.route")
);
router.use(
	"/npp",
	AuthMiddleware,
	AdminMiddleware,
	require("./nhaphanphoi.route")
);
router.use(
	"/xuathang",
	AuthMiddleware,
	require("./xuathang.route")
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
	"/khuyenmaigiam",
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
