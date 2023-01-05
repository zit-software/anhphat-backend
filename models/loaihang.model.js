const { DataTypes } = require("sequelize");

const sequelize = require("~/services/sequelize.service");

const LoaiHangModel = sequelize.define(
	"loaihang",
	{
		ma: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true,
			allowNull: false,
		},
		ten: {
			type: DataTypes.TEXT,
			allowNull: false,
		},
	},
	{ timestamps: true }
);

module.exports = LoaiHangModel;
