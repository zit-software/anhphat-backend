const ChiTietPhieuNhapQuaModel = require("../models/chitietnhapquakd.model")
const PhieuNhapQuaKDModel
class PhieuNhapQuaKhuyenDungController {
	/**
	 *
	 * @param{import('express').Request} req,
	 * @param{import('express').Response} res,
	 */
	async taophieunhap(req, res) {
		try {
            const {...phieuNhapInfo, chitiets} = req.body
            const newPhieuNhap = await 
            for (const chitiet of chitiets){
                const {ma, soluong} = chitiet 
                const newChiTiet = await ChiTietPhieuNhapQuaModel.create({maQuaKD: ma, soluong})
            }
		} catch (error) {
			return res
				.status(400)
				.json({ message: error.message })
				.end();
		}
	}
}
module.exports = new PhieuNhapQuaKhuyenDungController();
