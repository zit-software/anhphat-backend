const LoaiHangModel = require("~/models/loaihang.model");

class LoaiHangController {
	/**
	 *
	 * @param {import('express').Request} req
	 * @param {import('express').Response} res
	 */
	async themloaihang(req, res) {
		try {
			const newLoaiHang = await LoaiHangModel.create(
				req.body
			);
			return res.status(200).json(newLoaiHang);
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
	async laytatcaloaihang(req, res) {
		try {
			const allLoaiHang =
				await LoaiHangModel.findAll();
			return res.status(200).json(allLoaiHang);
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
	async xoatatcaloaihang(req, res) {
		try {
			await LoaiHangModel.destroy({ where: {} });
			return res.status(200).json({
				message: "Đã Xóa Tất Cả Loại Hàng",
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
	async layloaihang(req, res) {
		try {
			const ma = req.params.ma;
			const loaiHang = await LoaiHangModel.findOne({
				where: { ma },
			});
			return res.status(200).json(loaiHang);
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
	async sualoaihang(req, res) {
		try {
			const ma = req.params.ma;
			const currentLoaiHang =
				await LoaiHangModel.findOne({
					where: { ma },
				});
			if (!currentLoaiHang)
				throw new Error(
					"Không tồn tại mã loại hàng"
				);
			const newLoaiHang = req.body;
			await LoaiHangModel.update(newLoaiHang, {
				where: { ma },
			});
			return res
				.status(200)
				.json({ message: "Cập nhật thành công" });
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
	async xoaloaihang(req, res) {
		try {
			const ma = req.params.ma;
			const currentLoaiHang =
				await LoaiHangModel.findOne({
					where: { ma },
				});
			if (!currentLoaiHang)
				throw new Error(
					"Không tồn tại mã loại hàng"
				);
			await LoaiHangModel.update(
				{ xoavao: new Date() },
				{ where: { ma } }
			);
			return res.status(200).json({
				message: "Xóa Thành Công",
			});
		} catch (error) {
			res.status(400).send({
				message: error.message,
			});
		}
	}
}

module.exports = new LoaiHangController();
