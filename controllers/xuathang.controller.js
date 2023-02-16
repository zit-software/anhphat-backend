const { Op, where } = require("sequelize");
const ChiTietKMT = require("~/models/chitietkmt.model");
const ChiTietPhieuXuatModel = require("~/models/chitietphieuxuat.model");
const DonViModel = require("~/models/donvi.model");
const KhuyenMaiGiamModel = require("~/models/khuyenmaigiam.model");
const KhuyenMaiTangModel = require("~/models/khuyenmaitang.model");
const LoaiHangModel = require("~/models/loaihang.model");
const LogDiemModel = require("~/models/logdiem.model");
const MatHangModel = require("~/models/mathang.model");
const NhaPhanPhoiModel = require("~/models/nhaphanphoi.model");
const PhieuXuatModel = require("~/models/phieuxuat.model");
const ThongKeModel = require("~/models/thongke.model");
const UserModel = require("~/models/user.model");
const sequelize = require("~/services/sequelize.service");

class XuatHangController {
	/**
	 *
	 * @param {import('express').Request} req
	 * @param {import('express').Response} res
	 */
	async taophieuxuat(req, res) {
		try {
			const {
				ngayxuat,
				manpp,
				mauser,
				makmg,
				makmt,
				istrahang,
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
				istrahang: istrahang || false,
			});
			phieuxuat = phieuxuat.toJSON();

			// Lấy thông tin nhà phân phối
			let npp = await NhaPhanPhoiModel.findOne({
				where: { ma: manpp },
				attributes: ["ma", "ten", "chietkhau"],
			});
			npp = npp.toJSON();
			const result = {
				ma: phieuxuat.ma,
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
	 * @param {import('express').Request} req
	 * @param {import('express').Response} res
	 */
	async laytatcaphieuxuat(req, res) {
		try {
			const trahang = req.query.trahang || false;
			const page = parseInt(req.query.page || 0);
			const limit = parseInt(req.query.limit || 10);
			const daluu = req.query.daluu || false;

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
							attributes: ["ma", "tile"],
							as: "kmg",
						},
						{
							model: KhuyenMaiTangModel,
							attributes: ["ma"],
							as: "kmt",
						},
					],
					where: {
						xoavao: null,
						daluu,
						istrahang: trahang,
					},
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
	 * @param {import('express').Request} req
	 * @param {import('express').Response} res
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
	/**
	 *
	 * @param {import('express').Request} req
	 * @param {import('express').Response} res
	 * @returns
	 */
	async layphieuxuat(req, res) {
		try {
			const ma = req.params.ma;
			const chitiet = req.query.chitiet;
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
						as: "kmg",
					},
					{
						model: KhuyenMaiTangModel,
						as: "kmt",
					},
				],
			});

			if (!phieuxuat)
				throw new Error("Phiếu xuất không tồn tại");
			phieuxuat = phieuxuat.toJSON();

			const options = {
				where: { maphieuxuat: ma },
				include: [
					{
						model: MatHangModel,
						include: [
							{
								model: LoaiHangModel,
							},
							{
								model: DonViModel,
							},
						],
					},
				],
			};

			if (!chitiet) {
				options.group = [
					"mathang.madv",
					"mathang.malh",
				];

				options.attributes = [
					"*",
					[
						sequelize.fn(
							"count",
							sequelize.col("*")
						),
						"soluong",
					],
					[
						sequelize.fn(
							"sum",
							sequelize.col("mathang.giaban")
						),
						"thanhtien",
					],
				];
			}

			// Lấy tất cả chi tiết thuộc phiếu xuất
			let allChiTietMua =
				await ChiTietPhieuXuatModel.findAll({
					...options,
					where: {
						tang: false,
						maphieuxuat: ma,
					},
				});
			let allChiTietTang =
				await ChiTietPhieuXuatModel.findAll({
					...options,
					where: {
						maphieuxuat: ma,
						tang: true,
					},
				});
			let kmt = null;
			if (phieuxuat.kmt?.ma) {
				const kmtDetails = await ChiTietKMT.findAll(
					{
						where: { makmt: phieuxuat.kmt.ma },
						include: [
							{
								model: LoaiHangModel,
								as: "lh",
							},
							{
								model: DonViModel,
								as: "dvmua",
							},
							{
								model: DonViModel,
								as: "dvtang",
							},
						],
					}
				).then((data) =>
					data.map((e) => e.toJSON())
				);
				kmt = {
					...phieuxuat.kmt,
					chitiet: kmtDetails,
				};
			}
			const result = {
				...phieuxuat,
				kmt,
				chitiet: allChiTietMua.map((chitiet) =>
					chitiet.toJSON()
				),
				chitiettang: allChiTietTang.map((chitiet) =>
					chitiet.toJSON()
				),
			};
			console.log(result);
			return res.status(200).json(result);
		} catch (error) {
			res.status(400).send({
				message: error.message,
			});
		}
	}
	async luuphieuxuat(req, res) {
		const t = await sequelize.transaction();
		try {
			const ma = req.params.ma;
			const manual = req.body.manual;
			const auto = req.body.auto;
			const thue = req.body.thue || 0;
			const savedMH = [];
			let tongtien = 0;
			let tongsl = 0;
			// Kiểm tra phiếu xuất có tồn tại không
			let phieuxuat = await PhieuXuatModel.findOne({
				where: { ma },
				include: {
					model: NhaPhanPhoiModel,
					as: "npp",
				},
				transaction: t,
			});
			if (!phieuxuat)
				throw new Error("Không tồn tại phiếu xuất");
			// Xử lý các mặt hàng manual
			phieuxuat = phieuxuat.toJSON();
			for (let mathang of manual) {
				const matHangFound =
					await MatHangModel.findOne({
						where: {
							ma: mathang.mh,
							xuatvao: { [Op.eq]: null },
						},
						include: {
							model: LoaiHangModel,
							attributes: ["ma", "ten"],
						},
						transaction: t,
					}).then((data) => data?.toJSON());
				if (!matHangFound)
					throw new Error(
						`Không tìm thấy mặt hàng với mã ${mathang.mh}`
					);
				savedMH.push(matHangFound);
				tongtien += +mathang.giaban;
				tongsl += 1;
				// Tạo các chi tiết phiếu xuất và chuyển mặt hàng thành đã xuất
				await ChiTietPhieuXuatModel.create(
					{
						maphieuxuat: ma,
						mamathang: mathang.mh,
					},
					{ transaction: t }
				);
				await MatHangModel.update(
					{
						xuatvao:
							phieuxuat.dataValues.ngayxuat,
						giaban: +mathang.giaban,
					},
					{
						where: { ma: matHangFound.ma },
						transaction: t,
					}
				);
			}

			// Xử lý các mặt hàng auto
			for (let autoOption of auto) {
				// Lặp qua các option
				const malh = autoOption.malh;
				const madv = autoOption.madv;
				const soluong = autoOption.soluong;
				const giaban = +autoOption.giaban;
				const allAvailables =
					await MatHangModel.findAll({
						where: {
							xuatvao: { [Op.is]: null },
							madv,
							malh,
						},
						include: [
							{
								model: DonViModel,
								as: "donvi",
							},
						],
						order: [["hsd", "ASC"]],
						transaction: t,
					}).then((data) => {
						return data.map((e) => e.toJSON());
					});
				if (allAvailables.length < soluong)
					throw new Error({
						message:
							"Không đủ mặt hàng để lập phiếu",
					});
				// Tạo các chi tiết phiếu xuất và chuyển mặt hàng thành đã xuất
				for (let i = 0; i < soluong; i++) {
					let available = allAvailables[i];
					savedMH.push(available);
					tongtien += giaban;
					tongsl += 1;
					await ChiTietPhieuXuatModel.create(
						{
							maphieuxuat: ma,
							mamathang: available.ma,
						},
						{ transaction: t }
					);
					await MatHangModel.update(
						{
							xuatvao:
								phieuxuat.dataValues
									.ngayxuat,
							giaban,
						},
						{
							where: { ma: available.ma },
							transaction: t,
						}
					);
				}
			}
			// Công việc: tạo log thongke, tính lại tổng số lượng và tổng tiền của phiếu, chuyển field da luu thanh true
			if (
				await PhieuXuatModel.findOne({
					where: { ma, daluu: true },
				})
			) {
				throw new Error(
					"Hóa đơn này đã được lưu trước đó"
				);
			}

			// Nhà phân phối sau thuế thì cộng thuế trước khi giảm giá chiết khẩu hoặc khuyến mãi
			if (!phieuxuat.npp.truocthue) {
				tongtien += tongtien * thue;
			}

			if (req.body.kmg) {
				const kmg =
					await KhuyenMaiGiamModel.findOne({
						where: { ma: req.body.kmg },
					});

				if (kmg) {
					const giamgia = Math.max(
						phieuxuat.npp.chietkhau,
						kmg.tile
					);
					tongtien -= tongtien * giamgia;
				} else {
					tongtien -=
						tongtien * phieuxuat.npp.chietkhau;
				}
			}

			// Nhà phân phối trước thuế thì cộng thuế sau khi giảm giá chiết khẩu hoặc khuyến mãi

			if (phieuxuat.npp.truocthue) {
				tongtien += tongtien * thue;
			}

			if (req.body.kmt) {
				const kmt =
					await KhuyenMaiTangModel.findOne({
						where: { ma: req.body.kmt },
					});

				if (kmt) {
					const allChitietKMT =
						await ChiTietKMT.findAll({
							where: { makmt: req.body.kmt },
							transaction: t,
						}).then((data) =>
							data.map((e) => e.toJSON())
						);
					const allChiTietPX =
						await ChiTietPhieuXuatModel.findAll(
							{
								attributes: [
									[
										sequelize.fn(
											"count",
											sequelize.col(
												"*"
											)
										),
										"soluong",
									],
									"mathang.malh",
									"mathang.madv",
								],
								where: { maphieuxuat: ma },
								include: {
									model: MatHangModel,
								},
								group: [
									"mathang.malh",
									"mathang.madv",
								],
								transaction: t,
							}
						).then((data) =>
							data.map((e) => e.toJSON())
						);
					for (const chitiet of allChitietKMT) {
						for (const ctpx of allChiTietPX) {
							if (
								chitiet.madvmua ===
								ctpx.mathang.madv
							) {
								const soluongtang =
									Math.floor(
										ctpx.soluong /
											chitiet.soluongmua
									) * chitiet.soluongtang;
								for (
									let i = 0;
									i < soluongtang;
									i++
								) {
									const mathang =
										await MatHangModel.findOne(
											{
												where: {
													madv: chitiet.madvtang,
													xuatvao:
														{
															[Op.is]:
																null,
														},
												},
												transaction:
													t,
											}
										).then((data) =>
											data?.toJSON()
										);
									if (!mathang)
										throw new Error(
											"Không tồn tại mặt hàng để tặng"
										);
									await ChiTietPhieuXuatModel.create(
										{
											maphieuxuat: ma,
											mamathang:
												mathang.ma,
											tang: true,
										},
										{
											transaction: t,
										}
									);
									await MatHangModel.update(
										{
											xuatvao:
												new Date(),
											giaban: 0,
										},
										{
											where: {
												ma: mathang.ma,
											},
											transaction: t,
										}
									);
								}
							}
						}
					}
				}
			}
			await PhieuXuatModel.update(
				{
					tongtien,
					tongsl,
					daluu: true,
					makmg: req.body.kmg,
					makmt: req.body.kmt,
					thue,
				},
				{ where: { ma }, transaction: t }
			);
			const previousLog = await ThongKeModel.findOne({
				order: [["ngay", "DESC"]],
				transaction: t,
			}).then((data) => data?.toJSON());

			const prevConLai = previousLog?.conlai || 0;
			await ThongKeModel.create(
				{
					thu: tongtien,
					conlai: tongtien + prevConLai,
					maphieuxuat: ma,
				},
				{ transaction: t }
			);
			// Tích điểm cho nhà phân phối
			const manpp = phieuxuat.dataValues.manpp;
			let totalDiem = 0;
			for (let mh of savedMH) {
				const donvi = await (
					await DonViModel.findOne({
						attributes: ["ma", "diem"],
						where: { ma: mh.madv },
					})
				).toJSON();
				totalDiem += donvi.diem;
			}
			await NhaPhanPhoiModel.update(
				{
					diem: sequelize.literal(
						`diem + ${totalDiem}`
					),
				},
				{ transaction: t, where: { ma: manpp } }
			);
			await LogDiemModel.create(
				{
					diem: totalDiem,
					ghichu: `Cộng điểm cho ${phieuxuat.dataValues.npp.ten}: mã hóa đơn xuất ${phieuxuat.dataValues.ma}`,
					manpp,
					mauser: phieuxuat.dataValues.mauser,
				},
				{ transaction: t }
			);
			await t.commit();

			return res.status(200).json({
				message: "Lưu phiếu xuất thành công",
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
	async taophieuxuatAuto(req, res) {
		const t = await sequelize.transaction();
		try {
			const ma = req.params.ma;

			const madv = req.body.madv;
			const malh = req.body.malh;
			const soluong = req.body.soluong;

			const allAvailables =
				await MatHangModel.findAll({
					where: {
						xuatvao: { [Op.eq]: null },
						madv,
						malh,
					},
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
		const t = await sequelize.transaction();

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
}

module.exports = new XuatHangController();
