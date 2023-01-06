class XuatHangController {
	/**
	 *
	 * @param {Request} req
	 * @param {Response} res
	 */
	async taophieuxuat(req, res) {
		try {
			return res.status(200);
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
	async laytatcaphieuxuat(req, res) {
		try {
			return res.status(200);
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
	async suaphieuxuat(req, res) {
		try {
			const ma = req.params.ma;
		} catch (error) {
			res.status(400).send({
				message: error.message,
			});
		}
	}
	async xoaphieuxuat(req, res) {
		try {
			const ma = req.params.ma;
		} catch (error) {
			res.status(400).send({
				message: error.message,
			});
		}
	}
	async layphieuxuat(req, res) {
		try {
			const ma = req.params.ma;
		} catch (error) {
			res.status(400).send({
				message: error.message,
			});
		}
	}
	async themloaihangvaophieu(req, res) {
		try {
			const ma = req.params.ma;
			return res.status(200);
		} catch (error) {
			res.status(400).send({
				message: error.message,
			});
		}
	}
	async luuphieuxuat(req, res) {
		try {
			const ma = req.params.ma;
			return res.status(200);
		} catch (error) {
			res.status(400).send({
				message: error.message,
			});
		}
	}
}

module.exports = new XuatHangController();
