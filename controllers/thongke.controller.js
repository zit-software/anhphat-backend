const { Op } = require("sequelize");
const ChiTietPhieuXuatModel = require("~/models/chitietphieuxuat.model");
const DonViModel = require("~/models/donvi.model");
const LoaiHangModel = require("~/models/loaihang.model");
const MatHangModel = require("~/models/mathang.model");
const NhaPhanPhoiModel = require("~/models/nhaphanphoi.model");
const PhieuXuatModel = require("~/models/phieuxuat.model");
const QuyCachModel = require("~/models/quycach.model");
const ThongKeModel = require("~/models/thongke.model");
const sequelize = require("~/services/sequelize.service");
const { addDays } = require("~/utils/common.util");
const QuyCachUtil = require("~/utils/QuyCachUtil");

class ThongkeController {
	/**
	 *
	 * @param {import('express').Request} req
	 * @param {import('express').Response} res
	 */
	async thongke(req, res) {
		try {
			const kieu = req.query.kieu;
			const ngaybd = new Date(req.query.ngaybd);
			let ngaykt = new Date(ngaybd);
			switch (kieu) {
				case "ngay": {
					break;
				}
				case "tuan": {
					addDays(ngaykt, 7);
					break;
				}
				case "thang": {
					addDays(ngaykt, 30);
					break;
				}
				case "nam": {
					addDays(ngaykt, 365);
					break;
				}
				default:
					throw new Error(
						"Kiểu thống kê không hợp lệ"
					);
			}

			const allThongKeThu =
				await ThongKeModel.findAll({
					attributes: [
						"ma",
						"maphieuxuat",
						"thu",
						"conlai",
					],
					where: {
						ngay: {
							[Op.between]: [ngaybd, ngaykt],
						},
						maphieuxuat: {
							[Op.ne]: null,
						},
					},
				});
			const allThongKeChi =
				await ThongKeModel.findAll({
					attributes: [
						"ma",
						"maphieunhap",
						"chi",
						"conlai",
					],
					where: {
						ngay: {
							[Op.between]: [ngaybd, ngaykt],
						},
						maphieunhap: {
							[Op.ne]: null,
						},
					},
				});
			const tongThu = allThongKeThu.reduce(
				(total, chitiet) =>
					total + chitiet.dataValues.thu,
				0
			);
			const tongChi = allThongKeChi.reduce(
				(total, chitiet) =>
					total + chitiet.dataValues.chi,
				0
			);
			return res.status(200).json({
				chitietnhap: allThongKeChi.map((thongke) =>
					thongke.toJSON()
				),
				chitietxuat: allThongKeThu.map((thongke) =>
					thongke.toJSON()
				),
				thongke: {
					thu: tongThu,
					chi: tongChi,
				},
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
	async thongkeloaihangban(req, res) {
		try {
			// Thống kê số lượng bán theo từng loại hàng (ở đơn vị nhỏ nhất)
			const ngaybd = req.query.ngaybd;
			const ngaykt = req.query.ngaykt;

			// Lấy tất cả loại hàng và đơn vị của chúng
			const allLoaiHangInfo =
				await LoaiHangModel.findAll({
					attributes: ["ma", "ten"],
				}).then((data) =>
					data.map((e) => e.toJSON())
				);
			const allLoaiHang = [];
			for (let loaihang of allLoaiHangInfo) {
				const allDonvis = await DonViModel.findAll({
					where: { malh: loaihang.ma },
				}).then((data) =>
					data.map((e) => e.toJSON())
				);
				allLoaiHang.push({
					...loaihang,
					donvi: allDonvis,
				});
			}

			const result = [];
			const allMatHang = await MatHangModel.findAll({
				attributes: [
					[
						sequelize.fn(
							"count",
							sequelize.col("*")
						),
						"soluong",
					],
					"malh",
					"madv",
				],
				where: {
					xuatvao: {
						[Op.between]: [ngaybd, ngaykt],
					},
				},
				include: { model: LoaiHangModel },
				group: ["malh", "madv"],
			}).then((res) => res.map((e) => e.toJSON()));

			console.log(allMatHang);

			for (let mathang of allMatHang) {
				const dvnnObj =
					await QuyCachUtil.convertToSmallestUnit(
						mathang.madv,
						1
					);
				const soluongDonViNhoNhat =
					dvnnObj.soluong * mathang.soluong;
				const donviNhoNhat = dvnnObj.donvi;
				const foundIndex = result.findIndex(
					(thongke) =>
						thongke?.loaihang.ma ===
						mathang.malh
				);
				if (foundIndex !== -1) {
					result[foundIndex] = {
						...result[foundIndex],
						soluong:
							result[foundIndex].soluong +
							soluongDonViNhoNhat,
					};
				} else {
					result.push({
						loaihang: {
							ma: mathang.malh,
							ten: mathang.loaihang.ten,
						},
						soluong: soluongDonViNhoNhat,
						donvi: donviNhoNhat,
					});
				}
			}

			return res.status(200).json(result);
		} catch (error) {
			console.log(error);
		}
	}
	async thongkeloaihangnhap(req, res) {
		try {
			// Thống kê số lượng bán theo từng loại hàng (ở đơn vị nhỏ nhất)
			const ngaybd = req.query.ngaybd;
			const ngaykt = req.query.ngaykt;

			// Lấy tất cả loại hàng và đơn vị của chúng
			const allLoaiHangInfo =
				await LoaiHangModel.findAll({
					attributes: ["ma", "ten"],
				}).then((data) =>
					data.map((e) => e.toJSON())
				);
			const allLoaiHang = [];
			for (let loaihang of allLoaiHangInfo) {
				const allDonvis = await DonViModel.findAll({
					where: { malh: loaihang.ma },
				}).then((data) =>
					data.map((e) => e.toJSON())
				);
				allLoaiHang.push({
					...loaihang,
					donvi: allDonvis,
				});
			}

			const result = [];
			const allMatHang = await MatHangModel.findAll({
				where: {
					ngaynhap: {
						[Op.between]: [ngaybd, ngaykt],
					},
				},
				include: LoaiHangModel,
				attributes: ["malh", "madv"],
			}).then((data) => data.map((e) => e.toJSON()));
			for (let mathang of allMatHang) {
				const dvnnObj =
					await QuyCachUtil.convertToSmallestUnit(
						mathang.madv,
						1
					);
				const soluongDonViNhoNhat = dvnnObj.soluong;
				const donviNhoNhat = dvnnObj.donvi;
				const foundIndex = result.findIndex(
					(thongke) =>
						thongke?.loaihang.ma ===
						mathang.malh
				);
				if (foundIndex !== -1) {
					result[foundIndex] = {
						...result[foundIndex],
						soluong:
							result[foundIndex].soluong +
							soluongDonViNhoNhat,
					};
				} else {
					result.push({
						loaihang: {
							ma: mathang.loaihang.ma,
							ten: mathang.loaihang.ten,
						},
						soluong: soluongDonViNhoNhat,
						donvi: donviNhoNhat,
					});
				}
			}

			return res.status(200).json(result);
		} catch (error) {
			console.log(error);
		}
	}
	/**
	 *
	 * @param {import('express').Request} req
	 * @param {import('express').Response} res
	 */
	async thongkeTheoNgay(req, res) {
		try {
			const ngaybd = req.query.ngaybd;
			const ngaykt = req.query.ngaykt;

			const thongke = await ThongKeModel.findAll({
				where: {
					ngay: {
						[Op.between]: [ngaybd, ngaykt],
					},
				},
			});

			const max = thongke.reduce(
				(prev, current) =>
					Math.max(
						prev,
						current.thu,
						current.chi,
						current.conlai
					),
				-Infinity
			);

			const tongthu = thongke.reduce(
				(prev, current) => prev + current.thu,
				0
			);

			const tongchi = thongke.reduce(
				(prev, current) => prev + current.chi,
				0
			);

			const lastLast = await ThongKeModel.findOne({
				where: {
					ngay: {
						[Op.lt]: ngaybd,
					},
				},
				order: [["ngay", "desc"]],
			});

			const doanhthu =
				thongke[thongke.length - 1]?.conlai -
				(lastLast?.conlai || 0);

			res.send({
				data: thongke,
				max,
				tongthu,
				tongchi,
				doanhthu,
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
	async thongkeTheoTinh(req, res) {
		try {
			const ngaybd = req.query.ngaybd;
			const ngaykt = req.query.ngaykt;

			const allTinhs = await NhaPhanPhoiModel.findAll(
				{
					attributes: [
						[
							sequelize.fn(
								"DISTINCT",
								sequelize.col("tinh")
							),
							"tinh",
						],
					],
				}
			).then((data) => data.map((e) => e.toJSON()));
			const result = {};
			for (let tinh of allTinhs) {
				result[tinh.tinh] = [];
				const allNPP = (
					await NhaPhanPhoiModel.findAll({
						where: { tinh: tinh.tinh },
					})
				).map((e) => e.toJSON());
				for (let npp of allNPP) {
					const soLuongLH = [];
					const allChiTiet =
						await ChiTietPhieuXuatModel.findAll(
							{
								attributes: {
									exclude: [
										"createdAt",
										"updatedAt",
										"mamathang",
									],
								},
								include: [
									{
										model: PhieuXuatModel,
										attributes: [],
										include: {
											attributes: [],
											model: NhaPhanPhoiModel,
											as: "npp",
											where: {
												tinh: tinh.tinh,
											},
										},
									},
									{
										model: MatHangModel,
										attributes: [
											"ma",
											"malh",
											"madv",
										],
										where: {
											xuatvao: {
												[Op.between]:
													[
														ngaybd,
														ngaykt,
													],
											},
										},
									},
								],
							}
						).then((data) =>
							data.map((e) => e.toJSON())
						);
					for (let chitiet of allChiTiet) {
						const malh = chitiet.mathang.malh;
						const madv = chitiet.mathang.madv;
						const soluong =
							await QuyCachUtil.convertToSmallestUnit(
								madv,
								1
							);
						if (malh in soLuongLH) {
							soLuongLH[malh] += soluong;
						} else {
							soLuongLH[malh] = soluong;
						}
					}

					result[tinh.tinh].push({
						manpp: npp.ma,
						tennpp: npp.ten,
						lh: soLuongLH,
					});
				}
			}

			return res.status(200).json(result);
		} catch (error) {
			res.status(400).send({
				message: error.message,
			});
		}
	}
}

module.exports = new ThongkeController();
