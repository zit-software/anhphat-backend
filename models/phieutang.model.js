const { DataTypes } = require("sequelize");

const sequelize = require("~/services/sequelize.service");
const KhuyenMaiTangModel = require("./khuyenmaitang.model");
const PhieuXuatModel = require("./phieuxuat.model");

const PhieuTangModel = sequelize.define(
	"phieutang",
	{
		ma: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true,
			allowNull: false,
		},
		tongsl: {
			type: DataTypes.INTEGER,
			allowNull: false,
			validate: {
				min: 1,
			},
		},
	},
	{ timestamps: true }
);

PhieuTangModel.belongsTo(PhieuXuatModel, {
	foreignKey: {
		name: "maphieuxuat",
		allowNull: false,
	},
});
module.exports = PhieuTangModel;
