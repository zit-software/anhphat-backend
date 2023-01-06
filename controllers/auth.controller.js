class AuthController {
	async dangnhap(req, res) {
		try {
			return res.status(200);
		} catch (error) {
			console.log(error);
			return res.status(500).json(error);
		}
	}
	async xacthucnguoidung(req, res) {
		try {
			return res.status(200);
		} catch (error) {
			console.log(error);
			return res.status(500).json(error);
		}
	}
}

module.exports = new AuthController();
