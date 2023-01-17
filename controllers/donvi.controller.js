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
				gianhap: newDonVi.dataValues.gianhap,
				giaban: newDonVi.dataValues.giaban,
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
				.json({ message: "Đã xóa tất cả đơn vị" });
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
			const malh = req.query.loaihang;
			if (malh) {
				const allDonVi = await DonViModel.findAll({
					include: {
						model: LoaiHangModel,
					},
					where: { malh },
				});
				return res.status(200).json(allDonVi);
			}
			const allDonVi = await DonViModel.findAll({
				include: {
					model: LoaiHangModel,
				},
			});
			return res.status(200).json(allDonVi);
		} catch (error) {
			res.status(400).send({
				message: error.message,
			});
		}
	}
	async suadonvi(req, res) {
		try {
			const ma = req.params.ma;
			const currentDonVi = await DonViModel.findAll({
				where: { ma },
			});
			if (!currentDonVi)
				throw new Error("Không tồn tại đơn vị này");
			await DonViModel.update(req.body, {
				where: { ma },
			});
			return res
				.status(200)
				.json({ message: "Sửa thành công đơn vị" });
		} catch (error) {
			res.status(400).send({
				message: error.message,
			});
		}
	}
	async xoadonvi(req, res) {
		try {
			const ma = req.params.ma;
			const currentDonVi = await DonViModel.findAll({
				where: { ma },
			});
			if (!currentDonVi)
				throw new Error("Không tồn tại đơn vị này");
			await DonViModel.destroy({ where: { ma } });
			return res.status(200).json({
				message: "Xóa thành công đơn vị",
			});
		} catch (error) {
			res.status(400).send({
				message: error.message,
			});
		}
	}
}

module.exports = new DonViController();
