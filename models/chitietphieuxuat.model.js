const sequelize = require("~/services/sequelize.service");
const MatHangModel = require("./mathang.model");
const PhieuXuatModel = require("./phieuxuat.model");

const ChiTietPhieuXuatModel = sequelize.define(
	"chitietphieuxuat",
	{},
	{ timestamps: true }
);
ChiTietPhieuXuatModel.belongsTo(PhieuXuatModel, {
	foreignKey: {
		name: "maphieuxuat",
		allowNull: false,
	},
	onDelete: "CASCADE",
});

ChiTietPhieuXuatModel.belongsTo(MatHangModel, {
	foreignKey: {
		name: "mamathang",
		allowNull: false,
	},
	onDelete: "CASCADE",
});

module.exports = ChiTietPhieuXuatModel;
