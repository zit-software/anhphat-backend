const NhaPhanPhoiModel = require("~/models/nhaphanphoi.model");

class NhaPhanPhoiControler {
	/**
	 *
	 * @param {Request} req
	 * @param {Response} res
	 */
	async themnpp(req, res) {
		try {
			const ten = req.body.ten;
			const chietkhau = req.body.chietkhau;

			const newNpp = await NhaPhanPhoiModel.create({
				ten,
				chietkhau,
			});

			return res.send({
				data: newNpp.toJSON(),
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
	async laytatcanpp(req, res) {
		try {
			const allNpp = await NhaPhanPhoiModel.findAll();

			res.send(allNpp.map((e) => e.toJSON()));
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
	async laymotnpp(req, res) {
		try {
			const ma = req.params.ma;
			const npp = await NhaPhanPhoiModel.findOne({
				where: {
					ma,
				},
			});

			if (!npp) {
				throw new Error(
					"Nhà phân phối không tồn tại"
				);
			}

			res.send(npp.toJSON());
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
	async suamotnpp(req, res) {
		try {
			const ma = req.params.ma;
			const npp = await NhaPhanPhoiModel.findOne({
				where: {
					ma,
				},
			});

			if (!npp) {
				throw new Error(
					"Nhà phân phối không tồn tại"
				);
			}

			await NhaPhanPhoiModel.update(req.body, {
				where: { ma },
			});

			return res.send({
				message:
					"Cập nhật thông tin nhà phân phối thành công",
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
	async xoamotnpp(req, res) {
		try {
			const ma = req.params.ma;
			const npp = await NhaPhanPhoiModel.findOne({
				where: {
					ma,
				},
			});

			if (!npp) {
				throw new Error(
					"Nhà phân phối không tồn tại"
				);
			}

			await NhaPhanPhoiModel.destroy({
				where: { ma },
			});

			res.send({
				message: "Xóa nhà phân phối thành công",
			});
		} catch (error) {
			res.status(400).send({
				message: error.message,
			});
		}
	}
}
module.exports = new NhaPhanPhoiControler();
