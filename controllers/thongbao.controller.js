const SeenModel = require("~/models/seen.model");
const ThongBaoModel = require("~/models/thongbao.model");
const sequelize = require("~/services/sequelize.service");

class ThongBaoController {
	/**
	 *
	 * @param {import('express').Request} req
	 * @param {import('express').Response} res
	 */
	async getlatestThongBao(req, res) {
		try {
			const limit = req.query.limit || 10;
			const offset = req.query.offset || 0;
			const mauser = req.currentUser;

			const latestTB = await ThongBaoModel.findAll({
				order: ["createdAt", "DESC"],
				limit,
				offset,
			});
			const result = [];
			for (let tb of latestTB) {
				tb = tb.toJSON();
				const isSeen = SeenModel.findAll({
					where: { matb: tb.ma, mauser },
				});
				result.push({
					...tb,
					isSeen: !!isSeen,
				});
			}

			return res.status(200).json(result);
		} catch (error) {
			res.status(400).send({
				message: error.message,
			});
		}
	}
	async seenThongBao(req, res) {
		const t = await sequelize.transaction();
		try {
			// Truyền lên một mảng các mã thông báo
			const tbao = req.body.tbao;
			const mauser = req.currentUser;
			for (let ma of tbao) {
				const isSeen = SeenModel.findAll({
					where: { matb: ma, mauser },
				});
				if (!isSeen)
					await SeenModel.create(
						{
							matb: ma,
							mauser: mauser,
						},
						{ transaction: t },
					);
			}
			await t.commit();
			return res.status(200).json({
				message: "Người dùng đã xem các thông báo",
			});
		} catch (error) {
			await t.rollback();
			res.status(400).send({
				message: error.message,
			});
		}
	}
}

module.exports = new ThongBaoController();
