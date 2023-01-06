class QuantriController {
	/**
	 *
	 * @param {Request} req
	 * @param {Response} res
	 */
	async themtaikhoan(req, res) {
		try {
			const ten = req.body.ten;
			const matkhau = req.body.matkhau;
			const ladmin = req.body.ladmin;
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
	async laytaikhoan(req, res) {
		try {
			const ma = req.params.ma;
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
	async suataikhoan(req, res) {
		try {
			const ma = req.params.ma;
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
	async laytatcataikhoan(req, res) {
		try {
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
	async xoataikhoan(req, res) {
		try {
		} catch (error) {
			res.status(400).send({
				message: error.message,
			});
		}
	}
}

module.exports = new QuantriController();
