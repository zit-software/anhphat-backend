const sequelize = require("~/services/sequelize.service");
const { DataTypes } = require("sequelize");

const KhuyenMaiGiamModel = sequelize.define(
	"khuyenmaigiam",
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
		tile: {
			type: DataTypes.FLOAT,
			validate: {
				min: 0,
				max: 1,
			},
			defaultValue: 0,
		},
	},

	{
		timestamps: true,
		paranoid: true,
		deletedAt: "xoavao",
	},
);

module.exports = KhuyenMaiGiamModel;
