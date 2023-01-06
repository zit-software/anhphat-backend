class NhaphangController {
	/**
	 * Tạo phiếu nhập hàng
	 * @param {Request} req
	 * @param {Response} res
	 */
	async taophieunhap(req, res) {
		try {
		} catch (error) {
			res.status(400).send({
				message: error.message,
			});
		}
	}

	/**
	 * Xóa phiếu nhập hàng
	 * @param {Request} req
	 * @param {Response} res
	 */
	async xoaphieunhap(req, res) {
		try {
		} catch (error) {
			res.status(400).send({
				message: error.message,
			});
		}
	}

	/**
	 * Thêm sản phẩm vào phiếu nhập
	 * @param {Request} req
	 * @param {Response} res
	 */
	async themsanpham(req, res) {
		try {
		} catch (error) {
			res.status(400).send({
				message: error.message,
			});
		}
	}

	/**
	 * Lấy tất cả phiếu nhập
	 * @param {Request} req
	 * @param {Response} res
	 */
	async laytatcaphieunhap(req, res) {
		try {
		} catch (error) {
			res.status(400).send({
				message: error.message,
			});
		}
	}

	/**
	 * Lấy một phiếu nhập
	 * @param {Request} req
	 * @param {Response} res
	 */
	async laymotphieunhap(req, res) {
		try {
		} catch (error) {
			res.status(400).send({
				message: error.message,
			});
		}
	}

	/**
	 * Chỉnh sửa phiếu nhập
	 * @param {Request} req
	 * @param {Response} res
	 */
	async chinhsuaphieunhap(req, res) {
		try {
		} catch (error) {
			res.status(400).send({
				message: error.message,
			});
		}
	}
}

module.exports = new NhaphangController();
