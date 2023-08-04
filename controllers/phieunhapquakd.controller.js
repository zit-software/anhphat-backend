const ChiTietPhieuNhapQuaModel = require("../models/chitietnhapquakd.model");
const PhieuNhapQuaKDModel = require("../models/phieunhapquakhuyendung.model");
const sequelize = require("~/services/sequelize.service");
const UserModel = require("~/models/user.model");
const QuaKhuyenDungModel = require("~/models/quakhuyendung.model");
const { Sequelize } = require("sequelize");

class PhieuNhapQuaKhuyenDungController {
	/**
	 *
	 * @param{import('express').Request} req,
	 * @param{import('express').Response} res,
	 */
	async taophieunhap(req, res) {
		const t = await sequelize.transaction();
		try {
			const { chitiets, ...phieuNhapInfo } = req.body;
			const currentUser = req.currentUser;
			const newPhieuNhap =
				await PhieuNhapQuaKDModel.create(
					{
						...phieuNhapInfo,
						tongsl: chitiets.reduce(
							(pre, current) =>
								pre + current.soluong,
							0,
						),
						mauser: currentUser.ma,
					},
					{ plain: true, transaction: t },
				);
			for (const chitiet of chitiets) {
				const { ma, soluong } = chitiet;
				await ChiTietPhieuNhapQuaModel.create(
					{
						maQuaKD: ma,
						soluong,
						maPhieuNhapQuaKD: newPhieuNhap.ma,
					},
					{ transaction: t },
				);
				await QuaKhuyenDungModel.update(
					{
						soluong: Sequelize.literal(
							`soluong + ${soluong}`,
						),
					},
					{ where: { ma }, transaction: t },
				);
			}
			await t.commit();
			return res.status(200).json(newPhieuNhap);
		} catch (error) {
			await t.rollback();
			return res
				.status(400)
				.json({ message: error.message })
				.end();
		}
	}
	/**
	 *
	 * @param{import('express').Request} req,
	 * @param{import('express').Response} res,
	 */
	async getAllPhieuNhapQuaKD(req, res) {
		try {
			const page = req.query.page;
			const pageSize = 10;
			const offset = (page || 0) * pageSize;
			const allPhieus =
				await PhieuNhapQuaKDModel.findAll(
					{
						offset,
						limit: pageSize,
						include: [
							{
								attributes: [
									"ma",
									"ten",
									"laAdmin",
								],
								model: UserModel,
								as: "nguoinhap",
							},
						],
						order: [["updatedAt", "desc"]],
					},
					{ plain: true },
				);
			const total = await PhieuNhapQuaKDModel.count();
			return res
				.status(200)
				.json({ data: allPhieus, total });
		} catch (error) {
			return res
				.status(400)
				.json({ message: error.message })
				.end();
		}
	}
	/**
	 *
	 * @param{import('express').Request} req,
	 * @param{import('express').Response} res,
	 */
	async deletePhieuNhapQuaKD(req, res) {
		const t = await sequelize.transaction();
		try {
			const ma = req.params.ma;

			await ChiTietPhieuNhapQuaModel.destroy({
				where: { maPhieuNhapQuaKD: ma },
			});
			await PhieuNhapQuaKDModel.destroy({
				where: { ma },
			});
			await t.commit();
			return res
				.status(200)
				.json({ message: "Xóa thành công!" });
		} catch (error) {
			await t.rollback();
			return res
				.status(400)
				.json({ message: error.message });
		}
	}
	/**
	 *
	 * @param{import('express').Request} req,
	 * @param{import('express').Response} res,
	 */
	async getOne(req, res) {
		try {
			const ma = req.params.ma;
			const phieuNhap =
				await PhieuNhapQuaKDModel.findOne(
					{
						attributes: { exclude: "mauser" },
						where: { ma },
						include: {
							model: UserModel,
							attributes: { exclude: ["mk"] },
							as: "nguoinhap",
						},
					},
					{
						plain: true,
					},
				);
			if (!phieuNhap)
				throw new Error(
					"Không tồn tại phiếu nhập quà khuyến dụng có mã là " +
						ma,
				);
			const chitiets =
				await ChiTietPhieuNhapQuaModel.findAll(
					{
						where: { maPhieuNhapQuaKD: ma },
						include: {
							model: QuaKhuyenDungModel,
							as: "qua",
						},
					},
					{ plain: true },
				);

			return res.status(200).json({
				...phieuNhap.dataValues,
				chitiets,
			});
		} catch (error) {
			return res
				.status(400)
				.json({ message: error.message });
		}
	}
}
module.exports = new PhieuNhapQuaKhuyenDungController();
