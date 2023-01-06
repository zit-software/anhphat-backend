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
	"/nhaphanphoi",
	AuthMiddleware,
	AdminMiddleware,
	require("./nhaphanphoi.route")
);
router.use(
	"/xuathang",
	AuthMiddleware,
	require("./xuathang.route")
);

module.exports = router;
