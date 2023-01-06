class ThongkeController {
	/**
	 *
	 * @param {Request} req
	 * @param {Response} res
	 */
	async thongke(req, res) {
		try {
		} catch (error) {
			res.status(400).send({
				message: error.message,
			});
		}
	}
}

module.exports = new ThongkeController();
