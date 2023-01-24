const { Op } = require("sequelize");
const DonViModel = require("~/models/donvi.model");
const LoaiHangModel = require("~/models/loaihang.model");
const MatHangModel = require("~/models/mathang.model");
const NhaPhanPhoiModel = require("~/models/nhaphanphoi.model");
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
					"malh",
					"madv",
					[
						sequelize.fn(
							"count",
							sequelize.col("mathang.ma")
						),
						"soluong",
					],
				],
				where: {
					xuatvao: {
						[Op.and]: {
							[Op.between]: [ngaybd, ngaykt],
							[Op.not]: null,
						},
					},
				},
				include: { model: LoaiHangModel },
				group: ["malh", "madv"],
			}).then((res) => res.map((e) => e.toJSON()));

			for (let mathang of allMatHang) {
				const dvnnObj =
					await QuyCachUtil.convertToSmallestUnit(
						mathang.madv,
						mathang.soluong
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
				attributes: [
					"malh",
					"madv",
					[
						sequelize.fn(
							"count",
							sequelize.col("*")
						),
						"soluong",
					],
				],
				group: ["malh", "madv"],
			}).then((data) => data.map((e) => e.toJSON()));

			for (let mathang of allMatHang) {
				const dvnnObj =
					await QuyCachUtil.convertToSmallestUnit(
						mathang.madv,
						mathang.soluong
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
			const result = [];
			for (let tinh of allTinhs) {
				const npp = [];
				let sumDoanhThu = 0;
				const thongkeLoaiHangNPP =
					await sequelize.query(
						`SELECT npp.ma, npp.ten, mh.madv, mh.malh AS 'loaihang.ma', lh.ten AS 'loaihang.ten', COUNT(mh.ma) AS soluongmh FROM nhaphanphois AS npp JOIN phieuxuats AS px ON px.manpp = npp.ma JOIN chitietphieuxuats AS ctpx ON ctpx.maphieuxuat = px.ma JOIN mathangs AS mh ON ctpx.mamathang = mh.ma JOIN loaihangs AS lh ON mh.malh = lh.ma WHERE npp.tinh = ${tinh.tinh} and npp.xoavao is null and px.xoavao is null and ctpx.xoavao is null and mh.xoavao is null and lh.xoavao is null and px.ngayxuat between '${ngaybd}' and '${ngaykt}' GROUP BY mh.malh , mh.madv , npp.ma ORDER BY npp.ma;`,
						{ nest: true }
					);
				for (let thongke of thongkeLoaiHangNPP) {
					let findIndex = npp.findIndex(
						(npp) => npp.ma === thongke.ma
					);
					const loaihang = {
						...thongke.loaihang,
					};
					const dvnn =
						await QuyCachUtil.convertToSmallestUnit(
							thongke.madv,
							thongke.soluongmh
						);
					loaihang.soluong = dvnn.soluong;
					loaihang.donvi = dvnn.donvi;
					if (findIndex === -1) {
						const thongkeNPP = {
							ma: thongke.ma,
							ten: thongke.ten,
							loaihang: [],
						};
						thongkeNPP.loaihang.push(loaihang);
						npp.push(thongkeNPP);
					} else {
						const currentNPP = npp[findIndex];

						currentNPP.loaihang.push(loaihang);
					}
				}
				console.log(npp);
				const thongkeDoanhThuNpp =
					await sequelize.query(
						`SELECT npp.ma, sum(px.tongtien) as doanhthu FROM nhaphanphois AS npp JOIN phieuxuats AS px ON npp.ma = px.manpp where px.xoavao is null and npp.xoavao is null and npp.tinh = ${tinh.tinh} and px.daluu = 1 and px.ngayxuat between '${ngaybd}' and '${ngaykt}' group by npp.ma order by npp.ma;`,
						{ nest: true }
					);
				for (let thongke of thongkeDoanhThuNpp) {
					const currentNPP = npp.find(
						(npp) => npp.ma === thongke.ma
					);
					currentNPP.doanhthu = thongke.doanhthu;
					sumDoanhThu += +currentNPP.doanhthu;
				}
				result.push({
					tinh: tinh.tinh,
					npp,
					doanhthu: sumDoanhThu,
				});
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
