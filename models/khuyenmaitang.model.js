const sequelize = require("~/services/sequelize.service");
const { DataTypes } = require("sequelize");

const KhuyenMaiTangModel = sequelize.define(
	"khuyenmaitang",
	{
		ma: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			allowNull: false,
			autoIncrement: true,
		},
		ten: {
			type: DataTypes.TEXT,
			allowNull: false,
		},
	},

	{
		timestamps: true,
		paranoid: true,
		deletedAt: "xoavao",
	}
);

module.exports = KhuyenMaiTangModel;
