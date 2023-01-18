const DonViModel = require("~/models/donvi.model");
const LoaiHangModel = require("~/models/loaihang.model");
const QuyCachModel = require("~/models/quycach.model");

class QuyCachController {
	/**
	 *
	 * @param {Request} req
	 * @param {Response} res
	 */
	async themquycach(req, res) {
		try {
			const newQuyCach = await QuyCachModel.create(
				req.body
			);

			const dv1 = await DonViModel.findOne({
				attributes: ["ma", "ten", "malh"],
				where: { ma: req.body.madv1 },
			});
			const dv2 = await DonViModel.findOne({
				attributes: ["ma", "ten", "malh"],
				where: { ma: req.body.madv2 },
			});

			if (dv1.dataValues.malh != dv2.dataValues.malh)
				throw new Error(
					"Không thể quy đổi đơn vị giữa hai loại hàng khác nhau"
				);

			if (!dv1 || !dv2)
				throw new Error("Không tồn tại đơn vị");
			const result = {
				ma: newQuyCach.dataValues.ma,
				soluong: newQuyCach.dataValues.soluong,
				dv1: dv1.dataValues,
				dv2: dv2.dataValues,
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
	async laytatcaquycach(req, res) {
		try {
			const allQuyCach = await QuyCachModel.findAll(
				{}
			);
			const result = [];
			for (let quycach of allQuyCach) {
				let dv1 = await DonViModel.findOne({
					where: { ma: quycach.dataValues.madv1 },
					include: {
						model: LoaiHangModel,
					},
				});
				let dv2 = await DonViModel.findOne({
					where: { ma: quycach.dataValues.madv2 },
				});
				let loaihang = dv1.dataValues.loaihang;
				result.push({
					ma: quycach.dataValues.ma,
					lh: loaihang,
					dv1: {
						ma: dv1.dataValues.ma,
						ten: dv1.dataValues.ten,
					},
					dv2: dv2.dataValues,
					soluong: quycach.soluong,
					malh: loaihang?.ma,
					madv1: dv1.dataValues.ma,
					madv2: dv2.dataValues.ma,
				});
			}
			return res
				.status(200)
				.json(result.filter((e) => e.lh));
		} catch (error) {
			res.status(400).send({
				message: error.message,
			});
		}
	}
	async updateQuyCach(req, res) {
		try {
			const ma = req.params.ma;
			await QuyCachModel.update(req.body, {
				where: {
					ma,
				},
			});
			return res.status(200).json({
				message: "Cập nhật thành công",
			});
		} catch (error) {
			res.status(400).send({
				message: error.message,
			});
		}
	}
}

module.exports = new QuyCachController();
