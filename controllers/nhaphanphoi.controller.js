const LogDiemModel = require("~/models/logdiem.model");
const NhaPhanPhoiModel = require("~/models/nhaphanphoi.model");
const UserModel = require("~/models/user.model");
const sequelize = require("~/services/sequelize.service");

class NhaPhanPhoiControler {
	/**
	 *
	 * @param {import('express').Request} req
	 * @param {import('express').Response} res
	 */
	async themnpp(req, res) {
		try {
			const ten = req.body.ten;
			const chietkhau = req.body.chietkhau;
			const sdt = req.body.sdt || null;
			const tinh = req.body.tinh;

			const newNpp = await NhaPhanPhoiModel.create({
				ten,
				chietkhau,
				sdt,
				tinh,
			});

			return res.send({
				data: newNpp.toJSON(),
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
	async laytatcanpp(req, res) {
		try {
			const allNpp = await NhaPhanPhoiModel.findAll();
			const total = NhaPhanPhoiModel.count({});
			return res.status(200).json({
				data: allNpp.map((npp) => npp.toJSON()),
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
	 * @param {import('express').Request} req
	 * @param {import('express').Response} res
	 */
	async laymotnpp(req, res) {
		try {
			const ma = req.params.ma;
			const npp = await NhaPhanPhoiModel.findOne({
				where: {
					ma,
				},
			});

			if (!npp) {
				throw new Error(
					"Nhà phân phối không tồn tại"
				);
			}

			res.send(npp.toJSON());
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
	async suamotnpp(req, res) {
		try {
			const ma = req.params.ma;
			const npp = await NhaPhanPhoiModel.findOne({
				where: {
					ma,
				},
			});

			if (!npp) {
				throw new Error(
					"Nhà phân phối không tồn tại"
				);
			}

			await NhaPhanPhoiModel.update(req.body, {
				where: { ma },
			});

			return res.send({
				message:
					"Cập nhật thông tin nhà phân phối thành công",
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
	async xoamotnpp(req, res) {
		try {
			const ma = req.params.ma;
			const npp = await NhaPhanPhoiModel.findOne({
				where: {
					ma,
				},
			});

			if (!npp) {
				throw new Error(
					"Nhà phân phối không tồn tại"
				);
			}

			await NhaPhanPhoiModel.destroy({
				where: { ma },
			});

			res.send({
				message: "Xóa nhà phân phối thành công",
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
	async capnhatdiem(req, res) {
		const t = await sequelize.transaction();
		try {
			const ma = req.params.ma;
			const currentNPP =
				await NhaPhanPhoiModel.findOne({
					where: { ma },
					attributes: ["ma", "ten", "diem"],
				}).then((data) => data.toJSON());
			if (!currentNPP)
				throw new Error(
					"Nhà phân phối không tồn tại"
				);
			const currentDiem = currentNPP.diem;
			const currentUser = req.currentUser;
			const { diem, ghichu } = req.body;
			console.log(currentNPP);
			console.log(diem, currentDiem);
			console.log(diem - currentDiem);
			await LogDiemModel.create(
				{
					diem: diem - currentDiem,
					ghichu,
					mauser: currentUser.ma,
					manpp: ma,
				},
				{ transaction: t }
			);
			await NhaPhanPhoiModel.update(
				{
					diem,
				},
				{ where: { ma }, transaction: t }
			);
			await t.commit();
			return res.status(200).json({
				manpp: ma,
				diem,
				ghichu,
			});
		} catch (error) {
			await t.rollback();
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
	async getAllLogDiem(req, res) {
		try {
			const limit = req.query.page >= 0 ? 20 : null;
			const offset = limit
				? limit * req.query.page
				: 0;
			const allLogsDiem = await LogDiemModel.findAll({
				include: [
					{ model: NhaPhanPhoiModel, as: "npp" },
					{
						model: UserModel,
						as: "user",
					},
				],
				limit,
				offset,
				order: [["createdAt", "desc"]],
			}).then((data) => data.map((e) => e.toJSON()));
			const total = await LogDiemModel.count({});
			return res
				.status(200)
				.json({ data: allLogsDiem, total });
		} catch (error) {
			res.status(400).send({
				message: error.message,
			});
		}
	}
}
module.exports = new NhaPhanPhoiControler();
