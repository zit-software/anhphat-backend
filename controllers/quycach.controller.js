const { Sequelize } = require("sequelize");
const DonViModel = require("~/models/donvi.model");
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
				attributes: ["ma", "ten"],
				where: { ma: req.body.madv1 },
			});
			const dv2 = await DonViModel.findOne({
				attributes: ["ma", "ten"],
				where: { ma: req.body.madv2 },
			});

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
			const allQuyCach = await QuyCachModel.findAll({
				attributes: ["soluong", "madv1", "madv2"],
			});
			const result = [];
			for (let quycach of allQuyCach) {
				let dv1 = await DonViModel.findOne({
					attributes: ["ma", "ten"],
					where: { ma: quycach.dataValues.madv1 },
				});
				let dv2 = await DonViModel.findOne({
					attributes: ["ma", "ten"],
					where: { ma: quycach.dataValues.madv2 },
				});
				result.push({
					dv1: dv1.dataValues,
					dv2: dv2.dataValues,
					soluong: quycach.soluong,
				});
			}
			return res.status(200).json(result);
		} catch (error) {
			res.status(400).send({
				message: error.message,
			});
		}
	}
}

module.exports = new QuyCachController();
