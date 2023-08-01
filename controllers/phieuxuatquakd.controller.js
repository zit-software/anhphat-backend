const NhaPhanPhoiModel = require("~/models/nhaphanphoi.model");

class PhieuXuatQuaKDController {
	/**
	 *
	 * @param {import('express').Request} req
	 * @param {import('express').Response} res
	 */
	async taoPhieuXuatQuaKD(req, res) {
		try {
			const { chitiets, manpp, ...phieuXuatInfo } =
				req.body;
			const npp = await NhaPhanPhoiModel.findByPk(
				manpp,
				{ plain: true }
			);
			if (!npp)
				throw new Error(
					"Không tìm thấy nhà phân phối với mã " +
						manpp
				);
		} catch (error) {
			return res
				.status(400)
				.json({ message: error.message })
				.end();
		}
	}
}
module.exports = new PhieuXuatQuaKDController();
