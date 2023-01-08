const ChiTietPhieuXuatModel = require("~/models/chitietphieuxuat.model");
const KhuyenMaiGiamModel = require("~/models/khuyenmaigiam.model");
const KhuyenMaiTangModel = require("~/models/khuyenmaitang.model");
const LoaiHangModel = require("~/models/loaihang.model");
const MatHangModel = require("~/models/mathang.model");
const NhaPhanPhoiModel = require("~/models/nhaphanphoi.model");
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
					include: {
						model: LoaiHangModel,
						attributes: {
							exclude: [
								"updatedAt",
								"createdAt",
							],
						},
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
						include: {
							model: LoaiHangModel,
							attributes: ["ma", "ten"],
						},
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
			console.log({
				maphieuxuat: ma,
				mamathang: mamh,
			});
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
}

module.exports = new XuatHangController();
