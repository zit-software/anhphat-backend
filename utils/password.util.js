const bcrypt = require("bcrypt");

const saltRounds = 10;

const PasswordUtil = {
	hash(password) {
		return bcrypt.hashSync(password, saltRounds);
	},
	compare(password, hash) {
		return bcrypt.compareSync(password, hash);
	},
};

module.exports = PasswordUtil;
