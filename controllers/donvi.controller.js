const DonViModel = require("~/models/donvi.model");
const LoaiHangModel = require("~/models/loaihang.model");

class DonViController {
	/**
	 *
	 * @param {Request} req
	 * @param {Response} res
	 */
	async taodonvi(req, res) {
		try {
			const newDonVi = await DonViModel.create(
				req.body
			);
			const loaiHang = await LoaiHangModel.findOne({
				where: { ma: req.body.malh },
			});
			const result = {
				ma: newDonVi.dataValues.ma,
				ten: newDonVi.dataValues.ten,
				lh: loaiHang.dataValues,
			};
			return res.status(200).json(result);
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
	async xoatatcadonvi(req, res) {
		try {
			await DonViModel.destroy({ where: {} });
			return res
				.status(200)
				.json("Đã xóa tất cả đơn vị");
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
	async laytatcadonvi(req, res) {
		try {
			return res.status(200);
		} catch (error) {
			res.status(400).send({
				message: error.message,
			});
		}
	}
	async suadonvi(req, res) {
		try {
			const ma = req.params.ma;
			return res.status(200);
		} catch (error) {
			res.status(400).send({
				message: error.message,
			});
		}
	}
	async xoadonvi(req, res) {
		try {
			const ma = req.params.ma;
			return res.status(200);
		} catch (error) {
			res.status(400).send({
				message: error.message,
			});
		}
	}
}

module.exports = new DonViController();
