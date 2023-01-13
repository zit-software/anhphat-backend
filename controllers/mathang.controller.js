const MatHangModel = require("~/models/mathang.model");
const sequelize = require("~/services/sequelize.service");
const { Op } = require("sequelize");
class MathangController {
	/**
	 *
	 * @param {Request} req
	 * @param {Response} res
	 */
	async themmathang(req, res) {
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
	async laytatcamathang(req, res) {
		try {
			// Xử lý tham số query
			const loaihangQuery = req.query.loaihang;
			const donviQuery = req.query.donvi;
			const ngaynhapQuery = req.query.ngaynhap;
			let where = {
				daxuat: { [Op.ne]: null },
			};
			if (loaihangQuery) where.malh = loaihangQuery;
			if (donviQuery) where.madv = donviQuery;
			if (ngaynhapQuery)
				where.ngaynhap = {
					[Op.eq]: ngaynhapQuery,
				};
			console.log(where);
			// Lấy tất cả mặt hàng
			const allMH = await MatHangModel.findAll({
				attributes: [
					"ngaynhap",
					"hsd",
					"malh",
					"madv",
					"gianhap",
					[
						sequelize.fn(
							"count",
							sequelize.col("ma")
						),
						"soluong",
					],
				],
				group: [
					"ngaynhap",
					"hsd",
					"malh",
					"madv",
					"gianhap",
				],
				where,
			});
			return res
				.status(200)
				.json(allMH.map((mh) => mh.toJSON()));
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
	async chinhsuamathang(req, res) {
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
	async xoamathang(req, res) {
		try {
		} catch (error) {
			res.status(400).send({
				message: error.message,
			});
		}
	}
}

module.exports = new MathangController();
