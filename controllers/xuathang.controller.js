const ChiTietPhieuXuatModel = require("~/models/chitietphieuxuat.model");
const DonViModel = require("~/models/donvi.model");
const KhuyenMaiGiamModel = require("~/models/khuyenmaigiam.model");
const KhuyenMaiTangModel = require("~/models/khuyenmaitang.model");
const LoaiHangModel = require("~/models/loaihang.model");
const MatHangModel = require("~/models/mathang.model");
const NhaPhanPhoiModel = require("~/models/nhaphanphoi.model");
const PhieuNhapModel = require("~/models/phieunhap.model");
const PhieuXuatModel = require("~/models/phieuxuat.model");
const UserModel = require("~/models/user.model");
const sequelize = require("~/services/sequelize.service");

class XuatHangController {
	/**
	 *
	 * @param {Request} req
	 * @param {Response} res
	 */
	async taophieuxuat(req, res) {
		try {
			const {
				ngayxuat,
				manpp,
				mauser,
				makmg,
				makmt,
			} = req.body;

			// Nếu như phiếu xuất có khuyến mãi giảm thì lấy thông tin khuyến mãi giảm
			let kmg = null;
			if (makmg) {
				kmg = await KhuyenMaiGiamModel.findOne({
					where: { ma: makmg },
					attributes: {
						exclude: [
							"createdAt",
							"updatedAt",
							"malh",
						],
					},
					include: {
						model: LoaiHangModel,
						attributes: {
							exclude: [
								"createdAt",
								"updatedAt",
							],
						},
					},
				});
				kmg = kmg.toJSON();
			}

			// Nếu như phiếu xuất có khuyến mãi tặng thì lấy thông tin khuyến mãi tặng
			let kmt = null;
			if (makmt) {
				kmt = await KhuyenMaiTangModel.findOne({
					where: { ma: makmt },
					attributes: {
						exclude: ["updatedAt", "createdAt"],
					},
				});
			}
			// Lập phiếu xuất
			let phieuxuat = await PhieuXuatModel.create({
				ngayxuat,
				tongsl: 1,
				tongtien: 0,
				mauser,
				manpp,
				makmg,
				makmt,
			});
			phieuxuat = phieuxuat.toJSON();

			// Lấy thông tin nhà phân phối
			let npp = await NhaPhanPhoiModel.findOne({
				where: { ma: manpp },
				attributes: ["ma", "ten", "chietkhau"],
			});
			npp = npp.toJSON();
			const result = {
				ngayxuat: phieuxuat.ngayxuat,
				tongtien: phieuxuat.tongtien,
				tongsl: phieuxuat.tongsl,
				npp,
				kmg,
				kmt,
				ma: phieuxuat.ma,
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
	async laytatcaphieuxuat(req, res) {
		try {
			const page = parseInt(req.query.page || 0);
			const limit = parseInt(req.query.limit || 10);

			let allPhieuXuat = await PhieuXuatModel.findAll(
				{
					attributes: {
						exclude: [
							"createdAt",
							"updatedAt",
							"manpp",
							"mauser",
							"makmg",
						],
					},
					include: [
						{
							model: NhaPhanPhoiModel,
							attributes: {
								exclude: [
									"updatedAt",
									"createdAt",
								],
							},
							as: "npp",
						},
						{
							model: UserModel,
							attributes: ["ma", "ten"],
							as: "nguoinhap",
						},
						{
							model: KhuyenMaiGiamModel,
							attributes: ["ma"],
							as: "kmg",
							include: {
								model: LoaiHangModel,
								attributes: ["ma", "ten"],
							},
						},
						{
							model: KhuyenMaiTangModel,
							attributes: ["ma"],
							as: "kmt",
						},
					],
					where: { xoavao: null },
					limit,
					offset: limit * page,
				}
			);
			return res.status(200).json({
				data: allPhieuXuat,
				total: await PhieuXuatModel.count({
					where: { xoavao: null },
				}),
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
	async suaphieuxuat(req, res) {
		try {
			const ma = req.params.ma;
			await PhieuXuatModel.update(req.body, {
				where: { ma },
			});
			const newPhieuXuat =
				await PhieuXuatModel.findOne({
					where: { ma },
					attributes: [
						"ngayxuat",
						"tongsl",
						"tongtien",
						"xoavao",
					],
					include: {
						model: NhaPhanPhoiModel,
						attributes: [
							"ma",
							"ten",
							"chietkhau",
						],
						as: "npp",
					},
				});
			return res.status(200).json(newPhieuXuat);
		} catch (error) {
			res.status(400).send({
				message: error.message,
			});
		}
	}
	async xoaphieuxuat(req, res) {
		try {
			const ma = req.params.ma;
			const currentDate = new Date();
			await PhieuXuatModel.update(
				{ xoavao: currentDate },
				{ where: { ma } }
			);
			return res.status(200).json({
				message: "Xóa phiếu xuất thành công",
			});
		} catch (error) {
			res.status(400).send({
				message: error.message,
			});
		}
	}
	async layphieuxuat(req, res) {
		try {
			const ma = req.params.ma;
			let phieuxuat = await PhieuXuatModel.findOne({
				where: { ma },
				attributes: {
					exclude: [
						"createdAt",
						"updatedAt",
						"manpp",
						"mauser",
						"makmg",
					],
				},
				include: [
					{
						model: NhaPhanPhoiModel,
						attributes: {
							exclude: [
								"updatedAt",
								"createdAt",
							],
						},
						as: "npp",
					},
					{
						model: UserModel,
						attributes: ["ma", "ten"],
						as: "nguoinhap",
					},
					{
						model: KhuyenMaiGiamModel,
						attributes: ["ma"],
						as: "kmg",
						include: {
							model: LoaiHangModel,
							attributes: ["ma", "ten"],
						},
					},
					{
						model: KhuyenMaiTangModel,
						attributes: ["ma"],
						as: "kmt",
					},
				],
			});

			if (!phieuxuat)
				throw new Error("Phiếu xuất không tồn tại");
			phieuxuat = phieuxuat.toJSON();

			// Lấy tất cả chi tiết thuộc phiếu xuất
			let allChiTiet =
				await ChiTietPhieuXuatModel.findAll({
					where: { maphieuxuat: ma },
				});
			const result = {
				...phieuxuat,
				chitiet: allChiTiet.map((chitiet) =>
					chitiet.toJSON()
				),
			};
			return res.status(200).json(result);
		} catch (error) {
			res.status(400).send({
				message: error.message,
			});
		}
	}
	async themloaihangvaophieu(req, res) {
		try {
			const ma = +req.params.ma;

			const mamh = req.body.mamh;

			const mathang = await MatHangModel.findOne({
				where: { ma: mamh },
				attributes: ["ma", "giaban"],
				include: {
					model: LoaiHangModel,
					attributes: ["ma", "ten"],
				},
			});
			const giaban = mathang.dataValues.giaban;

			await ChiTietPhieuXuatModel.create({
				maphieuxuat: ma,
				mamathang: mamh,
			});
			await PhieuXuatModel.update(
				{
					tongsl: sequelize.literal("tongsl + 1"),
					tongtien: sequelize.literal(
						`tongtien + ${giaban}`
					),
				},
				{ where: { ma } }
			);

			const phieuxuat = await PhieuXuatModel.findOne({
				where: { ma },
				attributes: [
					"ngayxuat",
					"tongsl",
					"tongtien",
				],
				include: [
					{
						model: NhaPhanPhoiModel,
						attributes: [
							"ma",
							"ten",
							"chietkhau",
						],
						as: "npp",
					},
					{
						model: KhuyenMaiGiamModel,
						attributes: ["tile"],
						as: "kmg",
					},
					{
						model: KhuyenMaiTangModel,
						attributes: [
							"ma",
							"ten",
							"soluongmua",
							"soluongtang",
						],
						as: "kmt",
					},
				],
			});
			if (!phieuxuat)
				throw new Error("Phiếu xuất không tồn tại");

			return res.status(200).json({
				...phieuxuat.toJSON(),
				chitiet: {
					...mathang.toJSON(),
					giamgia: 0,
				},
			});
		} catch (error) {
			res.status(400).send({
				message: error.message,
			});
		}
	}
	async luuphieuxuat(req, res) {
		try {
			const ma = req.params.ma;
			return res.status(200);
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
	async taophieuxuatAuto(req, res) {
		const t = await sequelize.transaction();
		try {
			const ma = req.params.ma;

			const madv = req.body.madv;
			const malh = req.body.malh;
			const soluong = req.body.soluong;

			const allAvailables =
				await MatHangModel.findAll({
					where: { daxuat: false, madv, malh },
					attributes: [
						"ma",
						"ngaynhap",
						"hsd",
						"mathang.malh",
						"madv",
						"donvi.gianhap",
					],
					include: [
						{ model: DonViModel, as: "donvi" },
					],
					order: [["hsd", "ASC"]],
				}).then((data) =>
					data.map((e) => e.toJSON())
				);
			console.log(allAvailables);
			if (allAvailables.length < soluong)
				throw new Error({
					message:
						"Không đủ mặt hàng để lập phiếu",
				});
			const savedMH = [];
			let tongtien = 0;
			for (let mathang of allAvailables) {
				savedMH.push(mathang);
				tongtien += mathang.donvi.giaban;

				await ChiTietPhieuXuatModel.create({
					maphieuxuat: ma,
					mamathang: mathang.ma,
				});
			}
			await PhieuXuatModel.update(
				{
					tongsl: soluong,
					tongtien,
				},
				{ where: { ma } }
			);

			const phieuxuat = await PhieuXuatModel.findOne({
				where: { ma },
				attributes: [
					"ngayxuat",
					"tongsl",
					"tongtien",
				],
				include: [
					{
						model: NhaPhanPhoiModel,
						attributes: [
							"ma",
							"ten",
							"chietkhau",
						],
						as: "npp",
					},
					{
						model: KhuyenMaiGiamModel,
						attributes: ["tile", "malh"],
						as: "kmg",
					},
					{
						model: KhuyenMaiTangModel,
						attributes: ["ma", "ten"],
						as: "kmt",
					},
				],
			}).then((data) => data.toJSON());
			if (!phieuxuat)
				throw new Error("Phiếu xuất không tồn tại");

			await t.commit();
			return res.status(200).json({
				...phieuxuat,
				chitiet: savedMH.map((mathang) => {
					const giamgia = Math.max(
						phieuxuat.npp.chietkhau,
						phieuxuat.kmg.tile
					);
					return {
						...mathang,
						giamgia,
						giathuc:
							mathang.giaban -
							giamgia * mathang.giaban,
					};
				}),
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
	 * @param {Request} req
	 * @param {Response} res
	 */
	async taophieuxuatManual(req, res) {
		try {
			// Ma phieu xuat
			const ma = +req.params.ma;

			let tongtien = 0;
			const mathangArr = req.body.mh;
			const savedMH = [];

			for (let mamh of mathangArr) {
				const mathang = await MatHangModel.findOne({
					where: { ma: mamh },
					attributes: ["ma", "giaban"],
					include: {
						model: LoaiHangModel,
						attributes: ["ma", "ten"],
					},
				});
				savedMH.push(mathang.toJSON());
				tongtien += mathang.dataValues.giaban;

				await ChiTietPhieuXuatModel.create({
					maphieuxuat: ma,
					mamathang: mamh,
				});
			}
			await PhieuXuatModel.update(
				{
					tongsl: mathangArr.length,
					tongtien,
				},
				{ where: { ma } }
			);

			const phieuxuat = await PhieuXuatModel.findOne({
				where: { ma },
				attributes: [
					"ngayxuat",
					"tongsl",
					"tongtien",
				],
				include: [
					{
						model: NhaPhanPhoiModel,
						attributes: [
							"ma",
							"ten",
							"chietkhau",
						],
						as: "npp",
					},
					{
						model: KhuyenMaiGiamModel,
						attributes: ["tile", "malh"],
						as: "kmg",
					},
					{
						model: KhuyenMaiTangModel,
						attributes: ["ma", "ten"],
						as: "kmt",
					},
				],
			}).then((data) => data.toJSON());
			if (!phieuxuat)
				throw new Error("Phiếu xuất không tồn tại");

			return res.status(200).json({
				...phieuxuat,
				chitiet: savedMH.map((mathang) => {
					const giamgia = Math.max(
						phieuxuat.npp.chietkhau,
						phieuxuat.kmg.tile
					);
					return {
						...mathang,
						giamgia,
						giathuc:
							mathang.giaban -
							giamgia * mathang.giaban,
					};
				}),
			});
		} catch (error) {
			res.status(400).send({
				message: error.message,
			});
		}
	}
}

module.exports = new XuatHangController();
