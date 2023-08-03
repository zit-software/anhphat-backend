const { Router } = require("express");

const AdminMiddleware = require("~/middleware/admin.middleware");
const AuthMiddleware = require("~/middleware/auth.middleware");

const router = Router();

router.use("/auth", require("./auth.route"));

router.use(
	"/quantri",
	AuthMiddleware,
	AdminMiddleware,
	require("./quantri.route"),
);

router.use(
	"/loaihang",
	AuthMiddleware,
	require("./loaihang.route"),
);

router.use(
	"/donvi",
	AuthMiddleware,
	require("./donvi.route"),
);
router.use(
	"/quycach",
	AuthMiddleware,
	require("./quycach.route"),
);
router.use(
	"/npp",
	AuthMiddleware,
	require("./nhaphanphoi.route"),
);
router.use(
	"/xuathang",
	AuthMiddleware,
	require("./xuathang.route"),
);

router.use(
	"/mathang",
	AuthMiddleware,
	require("./mathang.route"),
);

router.use(
	"/nhaphang",
	AuthMiddleware,
	require("./nhaphang.route"),
);

router.use(
	"/khuyenmaigiam",
	AuthMiddleware,
	require("./khuyenmaigiam.route"),
);

router.use(
	"/khuyenmaitang",
	AuthMiddleware,
	require("./khuyenmaitang.route"),
);

router.use(
	"/thongke",
	AuthMiddleware,
	AdminMiddleware,
	require("./thongke.route"),
);

router.use(
	"/qua",
	AuthMiddleware,
	require("./quakhuyendung.route"),
);
module.exports = router;
