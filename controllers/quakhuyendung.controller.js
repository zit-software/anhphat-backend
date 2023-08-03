const { Op } = require("sequelize");
const QuaKhuyenDungModel = require("../models/quakhuyendung.model");
class QuaKhuyenDungController {
	/**
	 *
	 * @param {import('express').Request} req
	 * @param {import('express').Response} res
	 */

	async layTatCaQuaKhuyenDung(req, res) {
		try {
			const { ten, page } = req.query;
			const pageSize = 10;
			const offset = (page || 0) * pageSize;
			const where = {};
			if (ten) {
				where.ten = {
					[Op.like]: `%${ten}%`,
				};
			}
			const allQuaKhuyenDung =
				await QuaKhuyenDungModel.findAll({
					where,
					offset,
					limit: pageSize,
				});
			const total = await QuaKhuyenDungModel.count({
				where,
			});
			return res
				.status(200)
				.json({ data: allQuaKhuyenDung, total });
		} catch (error) {
			return res
				.status(400)
				.json({ message: error.message })
				.end();
		}
	}

	/**
	 *
	 * @param {import('express').Request} req
	 * @param {import('express').Response} res
	 */
	async taoQuaKhuyenDung(req, res) {
		try {
			const newQua = await QuaKhuyenDungModel.create(
				{
					...req.body,
				},
				{ plain: true }
			);
			return res.status(200).json(newQua);
		} catch (error) {
			return res
				.status(400)
				.json({ message: error.message });
		}
	}
	/**
	 *
	 * @param {import('express').Request} req
	 * @param {import('express').Response} res
	 */
	async xoaQuaKhuyenDung(req, res) {
		try {
			const ma = req.params.ma;
			await QuaKhuyenDungModel.destroy({
				where: { ma },
			});
			return res
				.status(200)
				.json({ message: "Xóa Thành Công" });
		} catch (error) {
			return res
				.status(400)
				.json({ message: error.message });
		}
	}

	/**
	 *
	 * @param {import('express').Request} req
	 * @param {import('express').Response} res
	 */
	async suaQuaKhuyenDung(req, res) {
		try {
			const ma = req.params.ma;
			await QuaKhuyenDungModel.update(
				{ ...req.body },
				{ where: { ma } }
			);
		} catch (error) {
			return res
				.status(400)
				.json({ message: error.message });
		}
	}
}
module.exports = new QuaKhuyenDungController();
