const PinModel = require("~/models/pin.model");
const UserModel = require("~/models/user.model");
const sequelize = require("~/services/sequelize.service");
const { hash } = require("~/utils/password.util");

class QuantriController {
	/**
	 *
	 * @param {import('express').Request} req
	 * @param {import('express').Response} res
	 */
	async themtaikhoan(req, res) {
		const t = await sequelize.transaction();
		try {
			const ten = req.body.ten;
			const matkhau = req.body.matkhau;
			const laAdmin = req.body.laAdmin;
			const pin = req.body.pin || "000000";

			await UserModel.create(
				{
					ten,
					mk: hash(matkhau),
					laAdmin,
				},
				{ transaction: t }
			);
			await PinModel.create(
				{
					pin,
				},
				{
					transaction: t,
				}
			);
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
	 * @param {import('express').Request} req
	 * @param {import('express').Response} res
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
	 * @param {import('express').Request} req
	 * @param {import('express').Response} res
	 */
	async suataikhoan(req, res) {
		const t = await sequelize.transaction();

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
			await UserModel.update(
				{
					mk: newUser.mk,
					ten: newUser.ten,
					sdt: newUser.sdt,
				},
				{
					where: { ma },
					transaction: t,
				}
			);
			if (newUser.pin)
				await PinModel.update(
					{
						pin: newUser.pin,
					},
					{
						where: {
							mauser: ma,
						},
						transaction: t,
					}
				);
			await t.commit();
			return res
				.status(200)
				.json({ message: "Sửa thành công" });
		} catch (error) {
			await t.rollback();
			res.status(400).send({
				message: error.message,
			});
		}
	}

	/**
	 *
	 * @param {import('express').Request} req
	 * @param {import('express').Response} res
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
					"sdt",
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
	 * @param {import('express').Request} req
	 * @param {import('express').Response} res
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
