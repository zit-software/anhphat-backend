var express = require("express");
var router = express.Router();

router.use("/auth", require("./auth.route"));
router.use("/quantri", require("./quantri.route"));

module.exports = router;
