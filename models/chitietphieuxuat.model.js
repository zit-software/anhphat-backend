const { DataTypes } = require("sequelize");
const sequelize = require("~/services/sequelize.service");
const MatHangModel = require("./mathang.model");
const PhieuXuatModel = require("./phieuxuat.model");

const ChiTietPhieuXuatModel = sequelize.define(
	"chitietphieuxuat",
	{
		tang: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
			defaultValue: false,
		},
	},
	{
		timestamps: true,
		paranoid: true,
		deletedAt: "xoavao",
	}
);
ChiTietPhieuXuatModel.belongsTo(PhieuXuatModel, {
	foreignKey: {
		name: "maphieuxuat",
		allowNull: false,
	},
});

ChiTietPhieuXuatModel.belongsTo(MatHangModel, {
	foreignKey: {
		name: "mamathang",
		allowNull: false,
	},
});

module.exports = ChiTietPhieuXuatModel;
