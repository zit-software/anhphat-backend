const KhuyenMaiTangModel = require("~/models/khuyenmaitang.model");
const LoaiHangModel = require("~/models/loaihang.model");

class KhuyenmaitangController {
	/**
	 *
	 * @param {Request} req
	 * @param {Response} res
	 */
	async taokhuyenmai(req, res) {
		try {
			await KhuyenMaiTangModel.create(req.body);
			res.send({
				message: "Thêm khuyến mãi thành công",
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
	async laytatca(req, res) {
		try {
			const where = {};

			if (req.query.malh) {
				where.malh = req.query.malh;
			}

			const kmt = (
				await KhuyenMaiTangModel.findAll({
					where,
					include: LoaiHangModel,
				})
			).map((e) => e.toJSON());

			for (const km of kmt) {
				km.lh = km.loaihang;
				delete km.loaihang;
				delete km.malh;
			}

			res.send(kmt);
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
	async chinhsua(req, res) {
		try {
			const ma = req.params.ma;

			const kmt = await KhuyenMaiTangModel.findOne({
				where: { ma },
			});

			if (!kmt) {
				throw new Error(
					"Mã khuyến mãi không tồn tại"
				);
			}

			await KhuyenMaiTangModel.update(req.body, {
				where: { ma },
			});

			res.send({
				message: "Khuyến mãi đã được cập nhật",
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
	async xoa(req, res) {
		try {
			const ma = req.params.ma;

			const kmt = await KhuyenMaiTangModel.findOne({
				where: { ma },
			});

			if (!kmt) {
				throw new Error(
					"Mã khuyến mãi không tồn tại"
				);
			}

			await KhuyenMaiTangModel.destroy({
				where: { ma },
			});

			res.send({
				message: "Khuyến mãi đã được xóa",
			});
		} catch (error) {
			res.status(400).send({
				message: error.message,
			});
		}
	}
}

module.exports = new KhuyenmaitangController();
