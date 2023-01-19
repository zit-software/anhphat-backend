const { Op } = require("sequelize");
const DonViModel = require("~/models/donvi.model");
const LoaiHangModel = require("~/models/loaihang.model");
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

			// Lấy tất cả loại hàng và đơn vị của chúng
			const allLoaiHangInfo =
				await LoaiHangModel.findAll().then((data) =>
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

			return res.status(200);
		} catch (error) {
			console.log(error);
		}
	}
	async thongkeloaihangnhap() {
		try {
			// Thống kê số lượng nhập theo từng loại hàng (ở đơn vị nhỏ nhất)
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
				attributes: [
					"ngay",
					[
						sequelize.fn(
							"sum",
							sequelize.col("thu")
						),
						"thu",
					],
					[
						sequelize.fn(
							"sum",
							sequelize.col("chi")
						),
						"chi",
					],
					[
						sequelize.fn(
							"max",
							sequelize.col("conlai")
						),
						"conlai",
					],
				],
				where: {
					ngay: {
						[Op.between]: [ngaybd, ngaykt],
					},
				},

				group: [
					sequelize.fn(
						"date",
						sequelize.col("ngay")
					),
				],
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

			const doanhthu =
				thongke[thongke.length - 1]?.conlai -
					thongke[0]?.conlai || 0;

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
}

module.exports = new ThongkeController();
