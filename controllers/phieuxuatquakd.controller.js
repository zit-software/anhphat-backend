const { Sequelize } = require("sequelize");
const ChiTietXuatQuaKD = require("~/models/chitietxuatquakd.model");
const NhaPhanPhoiModel = require("~/models/nhaphanphoi.model");
const PhieuXuatQuaKhuyenDungModel = require("~/models/phieuxuatquakhuyendung.model");
const QuaKhuyenDungModel = require("~/models/quakhuyendung.model");
const sequelize = require("~/services/sequelize.service");

class PhieuXuatQuaKDController {
	/**
	 *
	 * @param {import('express').Request} req
	 * @param {import('express').Response} res
	 */
	async taoPhieuXuatQuaKD(req, res) {
		const t = await sequelize.transaction();
		try {
			const { chitiets, manpp, ...phieuXuatInfo } =
				req.body;
			const npp = await NhaPhanPhoiModel.findByPk(
				manpp,
				{ plain: true, transaction: t }
			);
			const currentUser = req.currentUser;
			if (!npp)
				throw new Error(
					"Không tìm thấy nhà phân phối với mã " +
						manpp
				);
			const diemNPP = npp.diem;
			const tongsl = chitiets.reduce(
				(pre, current) => pre + current.soluong,
				0
			);
			const newPhieu =
				await PhieuXuatQuaKhuyenDungModel.create(
					{
						...phieuXuatInfo,
						tongsl,
						mauser: currentUser.ma,
						manpp,
					},
					{ transaction: t, plain: true }
				);
			let tongdiem = 0;
			for (const chitiet of chitiets) {
				const { ma, soluong } = chitiet;
				const quaKD =
					await QuaKhuyenDungModel.findByPk(
						ma,
						{
							transaction: t,
							plain: true,
						},
						{ transaction: t }
					);
				await ChiTietXuatQuaKD.create(
					{
						maQuaKD: ma,
						soluong,
						maPhieuXuatQuaKD: newPhieu.ma,
					},
					{ transaction: t }
				);
				tongdiem += quaKD.diem * soluong;
				await QuaKhuyenDungModel.update(
					{
						soluong: Sequelize.literal(
							`soluong - ${soluong}`
						),
					},
					{ where: { ma }, transaction: t }
				);
			}
			if (diemNPP < tongdiem)
				throw new Error(
					`Nhà phân phối này không đủ điểm để tặng những quà này (${diemNPP} < ${tongdiem})`
				);
			await NhaPhanPhoiModel.update(
				{
					diem: Sequelize.literal(
						`diem - ${tongdiem}`
					),
				},
				{ where: { ma: manpp }, transaction: t }
			);

			await t.commit();
			return res.status(200).json(newPhieu).end();
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
	 * @param {import('express').Request} req
	 * @param {import('express').Response} res
	 */
	async checkDiemVaSoluong(req, res) {}

	/**
	 *
	 * @param {import('express').Request} req
	 * @param {import('express').Response} res
	 */
	async getAllPhieuXuatQuaKD(req, res) {
		try {
			const page = req.query.page;
			const pageSize = 10;

			const offset = (page || 0) * pageSize;
			const allPhieus =
				await PhieuXuatQuaKhuyenDungModel.findAll(
					{
						offset,
						limit: pageSize,
					},
					{ plain: true }
				);
			const total =
				await PhieuXuatQuaKhuyenDungModel.count({});
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
}
module.exports = new PhieuXuatQuaKDController();
