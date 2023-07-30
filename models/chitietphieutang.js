const sequelize = require("~/services/sequelize.service");
const MatHangModel = require("./mathang.model");
const PhieuTangModel = require("./phieutang.model");

const ChiTietPhieuTangModel = sequelize.define(
	"chitietphieutang",
	{},
	{ timestamps: true },
);
ChiTietPhieuTangModel.belongsTo(PhieuTangModel, {
	foreignKey: {
		name: "maphieutang",
		allowNull: false,
	},
});
ChiTietPhieuTangModel.belongsTo(MatHangModel, {
	foreignKey: {
		name: "mamathang",
		allowNull: false,
	},
});

module.exports = ChiTietPhieuTangModel;
