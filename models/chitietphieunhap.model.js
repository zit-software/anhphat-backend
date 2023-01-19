const sequelize = require("~/services/sequelize.service");
const MatHangModel = require("./mathang.model");
const PhieuNhapModel = require("./phieunhap.model");

const ChiTietPhieuNhapModel = sequelize.define(
	"ChiTietPhieuNhap",
	{},
	{
		timestamps: true,
		paranoid: true,
		deletedAt: "xoavao",
	}
);
ChiTietPhieuNhapModel.belongsTo(PhieuNhapModel, {
	foreignKey: {
		name: "maphieunhap",
		allowNull: false,
	},
	onDelete: "CASCADE",
});
ChiTietPhieuNhapModel.belongsTo(MatHangModel, {
	foreignKey: {
		name: "mamathang",
		allowNull: false,
	},
});

module.exports = ChiTietPhieuNhapModel;
