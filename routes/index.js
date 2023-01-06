var express = require("express");
var router = express.Router();

router.use("/auth", require("./auth.route"));

module.exports = router;
