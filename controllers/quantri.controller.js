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
			const laadmin = req.body.laadmin;
			const userInDB = await UserModel.findOne({
				where: { ten },
			});
			// Kiểm tra tài khoản với tên này có tồn tại không
			if (userInDB)
				return res
					.status(403)
					.json("Tên này đã tồn tại");

			await UserModel.create({
				ten,
				mk: hash(matkhau),
				laadmin,
			});
			return res.status(200).json("Tạo thành công");
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
		} catch (error) {
			res.status(400).send({
				message: error.message,
			});
		}
	}
}

module.exports = new QuantriController();
