const KhuyenMaiGiamModel = require("~/models/khuyenmaigiam.model");
const LoaiHangModel = require("~/models/loaihang.model");

class KhuyenmaigiamController {
	/**
	 *
	 * @param {Request} req
	 * @param {Response} res
	 */
	async taokhuyenmai(req, res) {
		try {
			const newKhuyenMai =
				await KhuyenMaiGiamModel.create(req.body);

			res.send(newKhuyenMai.toJSON());
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

			const kmg = (
				await KhuyenMaiGiamModel.findAll({
					where,
					include: LoaiHangModel,
				})
			).map((e) => e.toJSON());

			for (const km of kmg) {
				km.lh = km.loaihang;
				delete km.loaihang;
				delete km.malh;
			}

			res.send(kmg);
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

			const km = await KhuyenMaiGiamModel.findOne({
				where: { ma },
			});

			if (!km) {
				throw new Error(
					"Mã khuyến mãi không tồn tại"
				);
			}

			await KhuyenMaiGiamModel.update(req.body, {
				where: { ma },
			});

			res.send({
				message: "Cập nhật khuyến mãi thành công",
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

			const km = await KhuyenMaiGiamModel.findOne({
				where: { ma },
			});
			if (!km) {
				throw new Error(
					"Mã khuyến mãi không tồn tại"
				);
			}

			await KhuyenMaiGiamModel.destroy({
				where: { ma },
			});

			res.send({
				message: "Xóa khuyến mãi thành công",
			});
		} catch (error) {
			res.status(400).send({
				message: error.message,
			});
		}
	}
}

module.exports = new KhuyenmaigiamController();
