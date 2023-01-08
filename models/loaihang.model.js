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
		gianhap: {
			type: DataTypes.BIGINT,
			allowNull: false,
			validate: {
				min: 0,
			},
		},
		giaban: {
			type: DataTypes.BIGINT,
			allowNull: false,
			validate: {
				min: 0,
			},
		},
		ten: {
			type: DataTypes.TEXT,
			allowNull: false,
		},
	},
	{ timestamps: true }
);

module.exports = LoaiHangModel;
