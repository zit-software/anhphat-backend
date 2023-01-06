class QuyCachController {
	/**
	 *
	 * @param {Request} req
	 * @param {Response} res
	 */
	async themquycach(req, res) {
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
	async laytatcaquycach(req, res) {
		try {
			return res.status(200);
		} catch (error) {
			res.status(400).send({
				message: error.message,
			});
		}
	}
}

module.exports = new QuyCachController();
