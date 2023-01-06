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

module.exports = router;
