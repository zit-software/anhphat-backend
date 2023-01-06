const jwt = require("jsonwebtoken");

const config = require("~/config");

const TokenUtil = {
	sign(data) {
		return jwt.sign(data, config.security.jwtSecret, {
			expiresIn: "2h",
		});
	},

	decode(token) {
		return jwt.decode(token, config.security.jwtSecret);
	},
};

module.exports = TokenUtil;
