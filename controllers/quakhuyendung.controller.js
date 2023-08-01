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
			const offset = page * pageSize;
			const where = {
				xuatvao: null,
			};
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
					soluong: 0,
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
}
module.exports = new QuaKhuyenDungController();
