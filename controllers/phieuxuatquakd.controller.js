const { Sequelize } = require("sequelize");
const ChiTietXuatQuaKD = require("~/models/chitietxuatquakd.model");
const LogDiemModel = require("~/models/logdiem.model");
const NhaPhanPhoiModel = require("~/models/nhaphanphoi.model");
const PhieuXuatQuaKhuyenDungModel = require("~/models/phieuxuatquakhuyendung.model");
const QuaKhuyenDungModel = require("~/models/quakhuyendung.model");
const UserModel = require("~/models/user.model");
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
				{ plain: true, transaction: t },
			);
			const currentUser = req.currentUser;
			if (!npp)
				throw new Error(
					"Không tìm thấy nhà phân phối với mã " +
						manpp,
				);
			const diemNPP = npp.diem;
			const tongsl = chitiets.reduce(
				(pre, current) => pre + current.soluong,
				0,
			);
			let tongdiem = 0;
			const newPhieu =
				await PhieuXuatQuaKhuyenDungModel.create(
					{
						...phieuXuatInfo,
						tongsl,
						mauser: currentUser.ma,
						manpp,
						tongdiem,
					},
					{ transaction: t, plain: true },
				);
			for (const chitiet of chitiets) {
				const { ma, soluong } = chitiet;
				const quaKD =
					await QuaKhuyenDungModel.findByPk(
						ma,
						{
							transaction: t,
							plain: true,
						},
						{ transaction: t },
					);
				if (quaKD.soluong < soluong)
					throw new Error(
						`Quà: '${quaKD.ten}' không đủ số lượng tồn kho, số lượng còn lại: ${quaKD.soluong}`,
					);
				await ChiTietXuatQuaKD.create(
					{
						maQuaKD: ma,
						soluong,
						maPhieuXuatQuaKD: newPhieu.ma,
					},
					{ transaction: t },
				);
				tongdiem += quaKD.diem * soluong;
				await QuaKhuyenDungModel.update(
					{
						soluong: Sequelize.literal(
							`soluong - ${soluong}`,
						),
					},
					{ where: { ma }, transaction: t },
				);
			}
			console.log(tongdiem);
			if (diemNPP < tongdiem)
				throw new Error(
					`Nhà phân phối này không đủ điểm để tặng những quà này (${diemNPP} < ${tongdiem})`,
				);
			await NhaPhanPhoiModel.update(
				{
					diem: Sequelize.literal(
						`diem - ${tongdiem}`,
					),
				},
				{ where: { ma: manpp }, transaction: t },
			);
			await LogDiemModel.create(
				{
					ghichu:
						"Đổi điểm cho nhà phân phối " +
						npp.ten,
					diem: -tongdiem,
					manpp,
					mauser: currentUser.ma,
				},
				{ transaction: t },
			);
			await PhieuXuatQuaKhuyenDungModel.update(
				{
					tongdiem,
				},
				{
					where: { ma: newPhieu.ma },
					transaction: t,
				},
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
						include: [
							{
								attributes: {
									exclude: ["mk"],
								},
								model: UserModel,
								as: "nguoinhap",
							},
							{
								model: NhaPhanPhoiModel,
								paranoid: false,
								as: "npp",
							},
						],
					},
					{ plain: true },
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

	/**
	 *
	 * @param {import('express').Request} req
	 * @param {import('express').Response} res
	 */
	async xoaPhieuXuatQuaKD(req, res) {
		try {
			const ma = req.params.ma;
			await ChiTietXuatQuaKD.destroy({
				where: { maPhieuXuatQuaKD: ma },
			});
			await PhieuXuatQuaKhuyenDungModel.destroy({
				where: { ma },
			});
			return res
				.status(200)
				.json({ message: "Xóa Thành Công" });
		} catch (error) {
			return res
				.status(400)
				.json({ message: error.message });
		}
	}

	/**
	 *
	 * @param {import('express').Request} req
	 * @param {import('express').Response} res
	 */
	async getOnePhieuXuatQua(req, res) {
		try {
			const ma = req.params.ma;
			const phieuXuat =
				await PhieuXuatQuaKhuyenDungModel.findOne(
					{
						where: { ma },
						attributes: { exclude: ["mauser"] },
						include: [
							{
								model: UserModel,
								as: "nguoinhap",
								attributes: {
									exclude: ["mk"],
								},
							},
							{
								model: NhaPhanPhoiModel,
								as: "npp",
							},
						],
					},
					{ plain: true },
				);
			if (!phieuXuat)
				throw new Error(
					"Không tồn tại phiếu xuất có mã là " +
						ma,
				);
			const chitiets = await ChiTietXuatQuaKD.findAll(
				{
					attributes: {
						exclude: [
							"maQuaKD",
							"maPhieuXuatQuaKD",
						],
					},
					where: { maPhieuXuatQuaKD: ma },
					include: [
						{
							model: QuaKhuyenDungModel,
							as: "qua",
						},
					],
				},
				{ plain: true },
			);
			return res.status(200).json({
				...phieuXuat.dataValues,
				chitiets,
			});
		} catch (error) {
			return res
				.status(400)
				.json({ message: error.message });
		}
	}
}
module.exports = new PhieuXuatQuaKDController();
