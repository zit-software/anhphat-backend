const UserModel = require("~/models/user.model");
const TokenUtil = require("~/utils/token.util");

/**
 *
 * @param {Request} req
 * @param {Response} res
 * @param {Function} next
 */
const AuthMiddleware = async (req, res, next) => {
	try {
		const authorization = req.headers.authorization;
		if (!authorization) {
			throw new Error("Access token is required");
		}

		const accessToken = String(authorization).replace(
			"Bearer ",
			""
		);
		if (!accessToken) {
			throw new Error("Access token is required");
		}

		const userDecoded = TokenUtil.decode(accessToken);

		if (!userDecoded) {
			throw new Error("Access token is invalid");
		}

		const user = await UserModel.findOne({
			where: { ma: userDecoded.ma },
		});

		req.currentUser = user.toJSON();

		next();
	} catch (error) {
		res.status(401).send({ message: error.message });
	}
};

module.exports = AuthMiddleware;
