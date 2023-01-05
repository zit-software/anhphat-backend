const sequelize = require("~/services/sequelize.service");
const MatHangModel = require("./mathang.model");
const PhieuNhapModel = require("./phieunhap.model");

const ChiTietPhieuNhapModel = sequelize.define(
	"ChiTietPhieuNhap",
	{},
	{ timestamps: true }
);
ChiTietPhieuNhapModel.belongsTo(PhieuNhapModel, {
	foreignKey: {
		name: "maphieunhap",
		allowNull: false,
	},
});
ChiTietPhieuNhapModel.belongsTo(MatHangModel, {
	foreignKey: {
		name: "mamathang",
		allowNull: false,
	},
});

module.exports = ChiTietPhieuNhapModel;
