class DonViController {
	/**
	 *
	 * @param {Request} req
	 * @param {Response} res
	 */
	async taodonvi(req, res) {
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
	async xoatatcadonvi(req, res) {
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
	async laytatcadonvi(req, res) {
		try {
			return res.status(200);
		} catch (error) {
			res.status(400).send({
				message: error.message,
			});
		}
	}
	async suadonvi(req, res) {
		try {
			const ma = req.params.ma;
			return res.status(200);
		} catch (error) {
			res.status(400).send({
				message: error.message,
			});
		}
	}
	async xoadonvi(req, res) {
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

module.exports = new DonViController();
