const { Op } = require("sequelize");
const ThongKeModel = require("~/models/thongke.model");
const { addDays } = require("~/utils/common.util");

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
	async thongkeloaihangban() {
		try {
			// Thống kê số lượng bán theo từng loại hàng (ở đơn vị nhỏ nhất)
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
}

module.exports = new ThongkeController();
