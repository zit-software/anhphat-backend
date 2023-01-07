const UserModel = require("~/models/user.model");
const { compare } = require("~/utils/password.util");
const { sign } = require("~/utils/token.util");

class AuthController {
	async dangnhap(req, res) {
		try {
			const { ten, matkhau } = req.body;
			const user = await UserModel.findOne({
				where: { ten },
			});

			if (!user)
				return res
					.status(404)
					.json("Sai Tài Khoản");
			const isValidPassword = compare(
				matkhau,
				user.mk
			);
			if (!isValidPassword)
				return res.status(404).json("Sai mật khẩu");
			if (user && isValidPassword) {
				const accessToken = sign({
					ten,
					matkhau,
				});
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
			return res.status(200);
		} catch (error) {
			console.log(error);
			return res.status(500).json(error);
		}
	}
}

module.exports = new AuthController();
