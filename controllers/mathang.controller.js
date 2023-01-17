const MatHangModel = require("~/models/mathang.model");
const sequelize = require("~/services/sequelize.service");
const { Op } = require("sequelize");
const LoaiHangModel = require("~/models/loaihang.model");
const DonViModel = require("~/models/donvi.model");
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
			const orderQuery = req.query.order;
			const where = {
				daxuat: false,
				xoavao: { [Op.eq]: null },
			};
			if (loaihangQuery) where.malh = loaihangQuery;
			if (donviQuery) where.madv = donviQuery;
			if (ngaynhapQuery)
				where.ngaynhap = {
					[Op.eq]: ngaynhapQuery,
				};
			const order = [];
			if (orderQuery == "hsd")
				order.push([orderQuery, "ASC"]);
			else if (orderQuery == "ngaynhap")
				order.push([orderQuery, "DESC"]);
			else if (orderQuery == "soluong")
				order.push([orderQuery, "ASC"]);

			const limit = req.query.page ? 10 : null;
			const offset = limit
				? limit * req.query.page
				: 0;

			// Lấy tất cả mặt hàng
			const allMH = await MatHangModel.findAll({
				where,
				include: [
					{
						model: LoaiHangModel,
					},
					{
						model: DonViModel,
					},
				],
				order,
				limit,
				offset,
			});
			const total = await MatHangModel.count({
				where,
			});
			return res.status(200).json({
				data: allMH.map((mh) => mh.toJSON()),
				total,
			});
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
