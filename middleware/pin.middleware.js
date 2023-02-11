const PinModel = require("~/models/pin.model");
const UserModel = require("~/models/user.model");
const TokenUtil = require("~/utils/token.util");

/**
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {Function} next
 */
const PinMiddleware = async (req, res, next) => {
	try {
		const pinInput = req.headers["x-pin"];
		const currentUser = req.currentUser;

		const pin = await PinModel.findOne({
			where: {
				mauser: currentUser.ma,
				pin: pinInput,
			},
		});
		if (pin) next();
		return res.status(403).json({
			message: "Mã pin không hợp lệ",
		});
	} catch (error) {
		res.status(401).send({ message: error.message });
	}
};

module.exports = PinMiddleware;
