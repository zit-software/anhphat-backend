const ChiTietKMT = require("~/models/chitietkmt.model");
const DonViModel = require("~/models/donvi.model");
const KhuyenMaiTangModel = require("~/models/khuyenmaitang.model");
const LoaiHangModel = require("~/models/loaihang.model");

class KhuyenmaitangController {
	/**
	 *
	 * @param {import('express').Request} req
	 * @param {import('express').Response} res
	 */
	async laymotkhuyenmai(req, res) {
		try {
			const ma = req.params.ma;
			const kmt = await KhuyenMaiTangModel.findOne({
				attributes: {
					exclude: [
						"createdAt",
						"updatedAt",
						"xoavao",
					],
				},
				where: { ma },
			}).then((kmt) => kmt.toJSON());
			const allChiTiet = (
				await ChiTietKMT.findAll({
					attributes: [
						"soluongmua",
						"soluongtang",
					],
					where: { makmt: ma },
					include: [
						{
							model: LoaiHangModel,
							attributes: ["ma", "ten"],
							as: "lh",
						},
						{
							model: DonViModel,
							attributes: ["ma", "ten"],
							as: "dvmua",
						},
						{
							model: DonViModel,
							attributes: ["ma", "ten"],
							as: "dvtang",
						},
					],
				})
			).map((chitiet) => chitiet.toJSON());
			return res.status(200).json({
				...kmt,
				chitiet: allChiTiet,
			});
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
	async taokhuyenmai(req, res) {
		try {
			const kmtData = req.body.kmt;
			const chitietKMT = req.body.chitiet;
			const newKMT = await KhuyenMaiTangModel.create(
				kmtData
			);
			for (let chitiet of chitietKMT) {
				await ChiTietKMT.create({
					...chitiet,
					makmt: newKMT.ma,
				});
			}
			return res.status(200).json({
				message: "Tạo khuyến mãi nhập thành công",
			});
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
	async themchitiet(req, res) {
		try {
			const makmt = req.params.ma;
			const kmt = KhuyenMaiTangModel.findOne({
				where: { ma: makmt },
			});
			if (!kmt)
				throw new Error(
					"Không tồn tại khuyến mãi tặng này"
				);
			// Xóa hết chi tiết cũ và tạo lại chi tiết mới

			await ChiTietKMT.destroy({
				where: { makmt },
			});

			const chitietKMT = req.body.chitiet;
			for (let chitiet of chitietKMT) {
				await ChiTietKMT.create({
					...chitiet,
					makmt,
				});
			}

			return res.status(200).json({
				message:
					"Thêm các chi tiết khuyến mãi thành công",
			});
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
	async chinhsuachitiet(req, res) {
		try {
			const makmt = req.params.ma;
			const kmt = KhuyenMaiTangModel.findOne({
				attributes: ["ma"],
				where: { ma: makmt },
			});
			if (!kmt)
				throw new Error(
					"Không tồn tại khuyến mãi tặng này"
				);

			const chitietKMT = req.body.chitiet;
			console.log(chitietKMT);
			const malh = req.body.malh;
			const madvmua = chitietKMT.madvmua;
			const madvtang = chitietKMT.madvtang;
			await ChiTietKMT.update(chitietKMT, {
				where: { makmt, malh, madvmua, madvtang },
			});
			return res.status(200).json({
				message:
					"Cập nhật chi tiết khuyến mãi thành công",
			});
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
	async laytatca(req, res) {
		try {
			const where = {};

			if (req.query.malh) {
				where.malh = req.query.malh;
			}

			const kmt = (
				await KhuyenMaiTangModel.findAll({
					where,
				})
			).map((e) => e.toJSON());

			res.send(kmt);
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
	 * @param {import('express').Request} req
	 * @param {import('express').Response} res
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
			await ChiTietKMT.destroy({
				where: { makmt: ma },
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
