const PinModel = require("~/models/pin.model");
const UserModel = require("~/models/user.model");
const { compare } = require("~/utils/password.util");
const { sign } = require("~/utils/token.util");

class AuthController {
	async dangnhap(req, res) {
		try {
			const { ma, matkhau } = req.body;
			const user = await UserModel.findOne({
				where: { ma },
			});

			if (!user)
				throw new Error(
					"Tài khoản hoặc mật khẩu không đúng",
				);

			const isValidPassword = compare(
				matkhau,
				user.mk,
			);
			if (!isValidPassword)
				throw new Error(
					"Tài khoản hoặc mật khẩu không đúng",
				);

			if (user && isValidPassword) {
				const accessToken = sign(user.dataValues);
				return res
					.status(200)
					.json({ accessToken });
			}
		} catch (error) {
			console.log(error);
			return res.status(500).json(error);
		}
	}
	async xacthucnguoidung(req, res) {
		try {
			delete req.currentUser.mk;
			res.send(req.currentUser);
		} catch (error) {
			console.log(error);
			return res.status(500).json(error);
		}
	}
	async kiemtrapin(req, res) {
		try {
			const currentUser = req.currentUser;
			const pinInput = req.body.pin;
			const pin = await PinModel.findOne({
				where: {
					pin: pinInput,
					mauser: currentUser.ma,
				},
			});
			if (!pin)
				return res.status(403).json({
					message: "Mã pin không chính xác",
				});
			return res.status(200).end();
		} catch (error) {
			console.log(error);
			return res
				.status(500)
				.json({ message: error.message });
		}
	}
}

module.exports = new AuthController();
