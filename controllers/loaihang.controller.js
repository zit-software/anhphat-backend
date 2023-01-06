class LoaiHangController {
	/**
	 *
	 * @param {Request} req
	 * @param {Response} res
	 */
	async themloaihang(req, res) {
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
	async laytatcaloaihang(req, res) {
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
	async xoatatcaloaihang(req, res) {
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
	async layloaihang(req, res) {
		try {
			const ma = req.params.ma;

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
	async sualoaihang(req, res) {
		try {
			const ma = req.params.ma;

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
	async xoaloaihang(req, res) {
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

module.exports = new LoaiHangController();
