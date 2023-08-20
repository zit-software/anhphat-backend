const MatHangModel = require("~/models/mathang.model");
const { Op } = require("sequelize");
const LoaiHangModel = require("~/models/loaihang.model");
const DonViModel = require("~/models/donvi.model");
const sequelize = require("~/services/sequelize.service");
const QuyCachUtil = require("~/utils/QuyCachUtil");
class MathangController {
	/**
	 *
	 * @param {import('express').Request} req
	 * @param {import('express').Response} res
	 */
	async laymathangSapHetHan(req, res) {
		const t = await sequelize.transaction();
		try {
			// Kiểm tra Mặt hàng có hạn sử dụng < 6 tháng
			const dayUntilExpired = 180;
			const currentDate = new Date();
			let dateMax = new Date();
			dateMax.setDate(
				currentDate.getDate() + dayUntilExpired,
			);

			const limit = req.query.page
				? 10
				: req.query.page === 0
				? 10
				: null;
			const offset = limit
				? limit * req.query.page
				: 0;
			const allNearExpired =
				await MatHangModel.findAll({
					attributes: [
						"ngaynhap",
						"hsd",
						[
							sequelize.fn(
								"count",
								sequelize.col("mathang.ma"),
							),
							"soluong",
						],
					],
					where: {
						hsd: {
							[Op.between]: [
								currentDate,
								dateMax,
							],
						},
						xuatvao: { [Op.eq]: null },
					},
					include: [
						{ model: LoaiHangModel },
						{ model: DonViModel },
					],
					order: ["ngaynhap"],
					group: ["madv", "ngaynhap", "hsd"],
					limit,
					offset,
				}).then((data) => {
					return data.map((e) => e.toJSON());
				});
			const total = await MatHangModel.count({
				where: {
					hsd: {
						[Op.between]: [
							currentDate,
							dateMax,
						],
					},
					xuatvao: { [Op.eq]: null },
				},
				group: ["madv", "ngaynhap", "hsd"],
			});
			await t.commit();
			return res.status(200).json({
				data: allNearExpired,
				total: total.length,
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
	 * @param {import('express').Request} req
	 * @param {import('express').Response} res
	 */
	async tieuHuyMatHangSapHetHan(req, res) {
		try {
			const { madv, ngaynhap, hsd } = req.query;
			console.log(req.query);
			await MatHangModel.destroy({
				where: {
					xuatvao: { [Op.eq]: null },
					madv,
					ngaynhap,
					hsd,
				},
			});
			return res.status(200).end();
		} catch (error) {
			console.log(error);
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
	async layloaihangSapHet(req, res) {
		try {
			// Lấy tất cả số lượng dựa theo loại hàng
			const minimunSoLuong = 72;
			const allSoLuongLoaiHang =
				await MatHangModel.findAll({
					attributes: [
						"malh",
						"madv",
						[
							sequelize.fn(
								"count",
								sequelize.col("mathang.ma"),
							),
							"soluong",
						],
					],
					where: {
						xuatvao: {
							[Op.eq]: null,
						},
					},
					include: { model: LoaiHangModel },
					group: ["malh", "madv"],
				}).then((res) =>
					res.map((e) => e.toJSON()),
				);
			// Chuyển đổi về số lượng của quy cách nhỏ nhất
			const soluongtheoLoaiHang = [];
			for (let loaihang of allSoLuongLoaiHang) {
				const dvnnObj =
					await QuyCachUtil.convertToSmallestUnit(
						loaihang.madv,
						loaihang.soluong,
					);
				const soluongDonViNhoNhat = dvnnObj.soluong;
				const donviNhoNhat = dvnnObj.donvi;
				const foundIndex =
					soluongtheoLoaiHang.findIndex(
						(thongke) =>
							thongke?.loaihang.ma ===
							loaihang.malh,
					);
				if (foundIndex !== -1) {
					soluongtheoLoaiHang[foundIndex] = {
						...soluongtheoLoaiHang[foundIndex],
						soluong:
							soluongtheoLoaiHang[foundIndex]
								.soluong +
							soluongDonViNhoNhat,
					};
				} else {
					soluongtheoLoaiHang.push({
						loaihang: {
							ma: loaihang.malh,
							ten: loaihang.loaihang.ten,
						},
						soluong: soluongDonViNhoNhat,
						donvi: donviNhoNhat,
					});
				}
			}
			const result = [];
			// Lặp qua các loại hàng để kiểm tra, loại hàng nào còn ít hơn 12 thì thông báo
			for (let loaihang of soluongtheoLoaiHang) {
				if (loaihang.soluong < minimunSoLuong) {
					result.push({
						ma: loaihang.loaihang.ma,
						ten: loaihang.loaihang.ten,
						soluong: loaihang.soluong,
						donvi: loaihang.donvi,
					});
				}
			}
			const allLH = await LoaiHangModel.findAll({
				attributes: ["ma", "ten"],
			});
			for (let lh of allLH) {
				const findIndex = result.findIndex(
					(ele) => ele.ma === lh.ma,
				);
				if (findIndex === -1) {
					result.push({
						ma: lh.ma,
						ten: lh.ten,
						soluong: 0,
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

	/**
	 *
	 * @param {import('express').Request} req
	 * @param {import('express').Response} res
	 */
	async laymotmathang(req, res) {
		try {
			const ma = req.query.ma;
			if (ma) {
				const mathang = await MatHangModel.findOne({
					where: { ma },
				});
				return res.status(200).json(mathang);
			}
			const ngaynhap = req.query.ngaynhap;
			const hsd = req.query.hsd;
			const malh = req.query.malh;
			const madv = req.query.madv;
			const mathang = await MatHangModel.findOne({
				where: {
					ngaynhap,
					hsd,
					malh,
					madv,
				},
			});
			return res.status(200).json(mathang);
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
	async laytatcamathang(req, res) {
		try {
			// Xử lý tham số query
			const loaihangQuery = req.query.loaihang;
			const donviQuery = req.query.donvi;
			const ngaynhapQuery = req.query.ngaynhap;
			const tenQuery = req.query.ten;
			const orderQuery = req.query.order;

			const limit = req.query.page
				? 20
				: req.query.page === 0
				? 20
				: null;
			const offset = limit
				? limit * req.query.page
				: 0;
			let group = null;
			let attributes = null;
			if (req.query.group) {
				attributes = [
					"hsd",
					"ngaynhap",
					"madv",
					"malh",

					[
						sequelize.fn(
							"count",
							sequelize.col("mathang.ma"),
						),
						"soluong",
					],
				];
				group = [
					"ngaynhap",
					"hsd",
					"mathang.malh",
					"madv",
				];
			}

			const where = {
				xuatvao: { [Op.eq]: null },
				xoavao: { [Op.eq]: null },
			};
			if (loaihangQuery) where.malh = loaihangQuery;
			if (donviQuery) where.madv = donviQuery;
			if (ngaynhapQuery)
				where.ngaynhap = {
					[Op.eq]: ngaynhapQuery,
				};
			const loaiHangWhere = {};
			if (tenQuery) {
				loaiHangWhere.ten = {
					[Op.like]: `%${tenQuery}%`,
				};
			}
			const order = [];
			if (orderQuery == "hsd")
				order.push([orderQuery, "ASC"]);
			else if (orderQuery == "ngaynhap")
				order.push([orderQuery, "DESC"]);
			else if (orderQuery == "soluong")
				order.push([orderQuery, "ASC"]);

			// Lấy tất cả mặt hàng
			const allMH = await MatHangModel.findAll({
				attributes,
				where,
				include: [
					{
						model: LoaiHangModel,
						where: loaiHangWhere,
					},
					{
						model: DonViModel,
					},
				],
				order,
				limit,
				offset,
				group,
			});
			let total = 0;
			if (group) {
				total = await MatHangModel.findAll({
					attributes: ["malh"],
					where,
					group,
				}).then((data) => data.length);
			} else {
				total = await MatHangModel.count({
					where,
					include: {
						model: LoaiHangModel,
						where: loaiHangWhere,
					},
				});
			}
			return res.status(200).json({
				data: allMH.map((mh) => mh.toJSON()),
				total,
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
	async chinhsuamathang(req, res) {
		try {
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
	async xoamathang(req, res) {
		try {
			const ma = req.params.ma;
			await MatHangModel.destroy({ where: { ma } });
			return res.status(200).json({
				msg: `Xóa mặt hàng với mã ${ma} thành công.`,
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
	async layMotMathang(req, res) {
		try {
			res.send(
				(
					await MatHangModel.findOne({
						where: { ma: req.params.ma },
						include: [
							{
								model: DonViModel,
							},
							{
								model: LoaiHangModel,
							},
						],
					})
				).toJSON(),
			);
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

	async laySoLuong(req, res) {
		try {
			const madv = req.params.madv;

			const result = await MatHangModel.count({
				where: {
					madv,
					xoavao: null,
					xuatvao: { [Op.eq]: null },
				},
			});

			res.send({
				soluong: result,
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
	async demSoLuongKho(req, res) {
		try {
			const result = await MatHangModel.findAll({
				attributes: [
					[
						sequelize.fn(
							"count",
							sequelize.col("mathang.ma"),
						),
						"soluong",
					],
				],
				where: {
					xoavao: null,
					xuatvao: { [Op.eq]: null },
				},
				include: [
					{
						model: DonViModel,
					},
					{ model: LoaiHangModel },
				],
				group: ["madv"],
			});
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
	async phanra(req, res) {
		const t = await sequelize.transaction();
		try {
			const ma = req.params.ma;
			const madvphanra = req.body.madvphanra;
			// Xóa mặt hàng hiện tại, thêm các mặt hàng mới ở đơn vị nhỏ hơn

			// Kiểm tra xem đã xuất chưa
			const currentMatHang =
				await MatHangModel.findOne({
					where: {
						ma,
						xuatvao: {
							[Op.eq]: null,
						},
					},
				}).then((data) => data?.toJSON());
			if (!currentMatHang)
				throw new Error(
					"Mặt hàng không tồn tại, kiếm tra lại đã xuất kho hay chưa",
				);

			const converted = await QuyCachUtil.convertUnit(
				currentMatHang.madv,
				madvphanra,
				1,
			);
			const soluongDVN = converted.soluong;
			if (soluongDVN === 1)
				throw new Error(
					"Không tồn tại quy cách để chuyển đổi 2 đơn vị này",
				);
			const dvn = converted.donvi;
			const createdMatHangs = [];
			for (let i = 0; i < soluongDVN; i++) {
				const newMH = await MatHangModel.create(
					{
						ngaynhap: currentMatHang.ngaynhap,
						hsd: currentMatHang.hsd,
						gianhap: currentMatHang.gianhap,
						giaban: currentMatHang.giaban,
						malh: currentMatHang.malh,
						madv: dvn.ma,
					},
					{ transaction: t },
				).then((data) => data.toJSON());
				createdMatHangs.push(newMH);
			}
			await MatHangModel.destroy({
				where: { ma },
				transaction: t,
			});

			await t.commit();
			return res.status(200).json(createdMatHangs);
		} catch (error) {
			await t.rollback();
			res.status(400).send({
				message: error.message,
			});
		}
	}
}

module.exports = new MathangController();
