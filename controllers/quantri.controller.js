const UserModel = require("~/models/user.model");
const { hash } = require("~/utils/password.util");

class QuantriController {
	/**
	 *
	 * @param {Request} req
	 * @param {Response} res
	 */
	async themtaikhoan(req, res) {
		try {
			const ten = req.body.ten;
			const matkhau = req.body.matkhau;
			const laAdmin = req.body.laAdmin;

			await UserModel.create({
				ten,
				mk: hash(matkhau),
				laAdmin,
			});
			return res
				.status(200)
				.json({ message: "Tạo thành công" });
		} catch (error) {
			res.status(400).send({
				message: error.message,
			});
		}
	}

	/**
	 *
	 * @param {Request} req
	 * @param {Response} res
	 */
	async laytaikhoan(req, res) {
		try {
			const ma = req.params.ma;
			const user = await UserModel.findOne({
				where: { ma },
			});
			if (!user)
				return res.status(404).json({
					message: "Không tồn tại người dùng",
				});

			// Không trả về mật khẩu
			// eslint-disable-next-line no-unused-vars
			const { mk, ...rest } = user.dataValues;
			return res.status(200).json(rest);
		} catch (error) {
			res.status(400).send({
				message: error.message,
			});
		}
	}

	/**
	 *
	 * @param {Request} req
	 * @param {Response} res
	 */
	async suataikhoan(req, res) {
		try {
			const ma = req.params.ma;

			const existingUser = await UserModel.findOne({
				where: { ma },
			});

			if (!existingUser)
				throw new Error(
					"Tài khoản này không tồn lại"
				);

			const newUser = req.body;

			// Nếu có mật khẩu trong request thì hash mật khẩu trước khi sửa
			if (newUser.mk) newUser.mk = hash(newUser.mk);
			await UserModel.update(newUser, {
				where: { ma },
			});
			return res
				.status(200)
				.json({ message: "Sửa thành công" });
		} catch (error) {
			res.status(400).send({
				message: error.message,
			});
		}
	}

	/**
	 *
	 * @param {Request} req
	 * @param {Response} res
	 */
	async laytatcataikhoan(req, res) {
		try {
			const allUsers = await UserModel.findAll({
				attributes: [
					"ma",
					"ten",
					"laAdmin",
					"createdAt",
					"updatedAt",
				],
			});
			return res.status(200).json(allUsers);
		} catch (error) {
			res.status(400).send({
				message: error.message,
			});
		}
	}

	/**
	 *
	 * @param {Request} req
	 * @param {Response} res
	 */
	async xoataikhoan(req, res) {
		try {
			const ma = req.params.ma;
			const existingUser = await UserModel.findOne({
				where: { ma },
			});

			if (!existingUser)
				throw new Error(
					"Tài khoản này không tồn lại"
				);
			if (existingUser.dataValues.isAdmin)
				throw new Error(
					"Bạn không được phép xóa tài khoản admin"
				);

			await UserModel.destroy({ where: { ma } });
			return res
				.status(200)
				.json({ message: "Xóa Thành Công" });
		} catch (error) {
			res.status(400).send({
				message: error.message,
			});
		}
	}
}

module.exports = new QuantriController();
