const ChiTietPhieuNhapModel = require("~/models/chitietphieunhap.model");
const DonViModel = require("~/models/donvi.model");
const LoaiHangModel = require("~/models/loaihang.model");
const MatHangModel = require("~/models/mathang.model");
const NhaPhanPhoiModel = require("~/models/nhaphanphoi.model");
const PhieuNhapModel = require("~/models/phieunhap.model");
const UserModel = require("~/models/user.model");
const sequelize = require("~/services/sequelize.service");

class NhaphangController {
	/**
	 * Tạo phiếu nhập hàng
	 * @param {Request} req
	 * @param {Response} res
	 */
	async taophieunhap(req, res) {
		try {
			const user = req.currentUser;
			const phieunhap = await PhieuNhapModel.create({
				...req.body,
				mauser: user.ma,
				tongsl: 1,
				tongtien: 0,
			});
			let nhapp = {};
			if (req.body.manpp) {
				nhapp = await NhaPhanPhoiModel.findOne({
					where: { ma: req.body.manpp },
					attributes: ["ma", "ten", "chietkhau"],
				});
				nhapp = nhapp.toJSON();
			}

			const result = {
				ma: phieunhap.dataValues.ma,
				nguon: phieunhap.dataValues.nguon,
				ngaynhap: phieunhap.dataValues.ngaynhap,
				nguoigiao: phieunhap.dataValues.nguoigiao,
				nguoilap: { ma: user.ma, ten: user.ten },
				npp: nhapp,
			};
			return res.status(200).json(result);
		} catch (error) {
			res.status(400).send({
				message: error.message,
			});
		}
	}

	/**
	 * Xóa phiếu nhập hàng
	 * @param {Request} req
	 * @param {Response} res
	 */
	async xoaphieunhap(req, res) {
		try {
			const ma = req.params.ma;
			// lấy ngày hiện tại và lưu vào ngày xóa
			const date = new Date();
			await PhieuNhapModel.update(
				{ xoavao: date },
				{ where: { ma } }
			);
			return res.status(200).json({
				message: "Xóa thành công",
			});
		} catch (error) {
			res.status(400).send({
				message: error.message,
			});
		}
	}

	/**
	 * Thêm sản phẩm vào phiếu nhập
	 * @param {Request} req
	 * @param {Response} res
	 */
	async themsanpham(req, res) {
		try {
			const {
				soluong,
				maphieunhap,
				madv,
				malh,
				hsd,
				gianhap,
			} = req.body;
			const phieunhap = await PhieuNhapModel.findOne({
				where: { ma: maphieunhap },
			});

			// Kiểm tra phiếu nhập tồn tại không
			if (!phieunhap)
				throw new Error("Không tồn tại phiếu nhập");

			// Tạo các mặt hàng vào kho
			const matHangDaTao = [];
			for (let i = 0; i < soluong; i++) {
				let mathang = await MatHangModel.create({
					ngaynhap: phieunhap.dataValues.ngaynhap,
					hsd: new Date(hsd),
					gianhap,
					giaban: 0,
					malh,
					madv,
				});
				mathang = mathang.toJSON();
				matHangDaTao.push({
					ma: mathang.ma,
					ngaynhap: mathang.ngaynhap,
					hsd: mathang.hsd,
					gianhap: mathang.gianhap,
				});
			}

			// Tạo các chi tiết phiếu nhập
			const chiTietDaTao = [];
			for (let i = 0; i < soluong; i++) {
				let chitietNhap =
					await ChiTietPhieuNhapModel.create({
						maphieunhap,
						mamathang: matHangDaTao[i].ma,
					});
				chitietNhap = chitietNhap.toJSON();
				chiTietDaTao.push({
					ma: chitietNhap.id,
					mamathang: chitietNhap.mamathang,
				});
			}

			// Lấy dữ liệu loại hàng và đơn vị trả về
			const loaiHang = await LoaiHangModel.findOne({
				attributes: ["ma", "ten"],
				where: { ma: malh },
			});
			const donvi = await DonViModel.findOne({
				attributes: ["ma", "ten"],
				where: { ma: madv, malh },
			});

			const result = {
				maphieunhap,
				mathang: matHangDaTao,
				chitiet: chiTietDaTao,
				loaiHang: loaiHang.toJSON(),
				donvi: donvi.toJSON(),
			};
			return res.status(200).json(result);
		} catch (error) {
			console.log(error);
			res.status(400).send({
				message: error.message,
			});
		}
	}

	/**
	 * Lấy tất cả phiếu nhập
	 * @param {Request} req
	 * @param {Response} res
	 */
	async laytatcaphieunhap(req, res) {
		try {
			const allphieunhap =
				await PhieuNhapModel.findAll({
					attributes: {
						exclude: [
							"xoavao",
							"mauser",
							"manpp",
						],
					},
					include: [
						{
							model: UserModel,
							attributes: ["ma", "ten"],
							as: "nguoinhap",
						},
						{
							model: NhaPhanPhoiModel,
							attributes: [
								"ma",
								"ten",
								"chietkhau",
							],
							as: "npp",
						},
					],
				});
			const result = [];
			for (let phieunhap of allphieunhap) {
				phieunhap = phieunhap.toJSON();
				const allchitiet =
					await ChiTietPhieuNhapModel.findAll({
						where: {
							maphieunhap: phieunhap.ma,
						},
					});
				result.push({
					...phieunhap,
					chitiet: allchitiet.map((chitiet) =>
						chitiet.toJSON()
					),
				});
			}
			return res.status(200).json(result);
		} catch (error) {
			res.status(400).send({
				message: error.message,
			});
		}
	}

	/**
	 * Lấy một phiếu nhập
	 * @param {Request} req
	 * @param {Response} res
	 */
	async laymotphieunhap(req, res) {
		try {
			const ma = req.params.ma;
			const phieunhap = await PhieuNhapModel.findOne({
				where: { ma },
				attributes: {
					exclude: ["xoavao", "mauser", "manpp"],
				},
				include: [
					{
						model: UserModel,
						attributes: ["ma", "ten"],
						as: "nguoinhap",
					},
					{
						model: NhaPhanPhoiModel,
						attributes: [
							"ma",
							"ten",
							"chietkhau",
						],
						as: "npp",
					},
				],
			});
			if (!phieunhap)
				throw new Error("Phiếu nhập không tồn tại");
			const allChiTiet =
				await ChiTietPhieuNhapModel.findAll({
					where: {
						maphieunhap:
							phieunhap.dataValues.ma,
					},
				});
			return res.status(200).json({
				...phieunhap.toJSON(),
				chitiet: allChiTiet.map((chitiet) =>
					chitiet.toJSON()
				),
			});
		} catch (error) {
			res.status(400).send({
				message: error.message,
			});
		}
	}

	/**
	 * Chỉnh sửa phiếu nhập
	 * @param {Request} req
	 * @param {Response} res
	 */
	async chinhsuaphieunhap(req, res) {
		try {
			const ma = req.params.ma;
			const phieunhap = await PhieuNhapModel.findOne({
				ma,
			});
			if (!phieunhap)
				throw new Error("Phiếu nhập không tồn tại");
			await PhieuNhapModel.update(req.body, {
				where: { ma },
			});
			return res.status(200).json({
				message: "Sửa phiếu nhập thành công",
			});
		} catch (error) {
			res.status(400).send({
				message: error.message,
			});
		}
	}
}

module.exports = new NhaphangController();
