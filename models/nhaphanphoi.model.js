const { DataTypes } = require("sequelize");

const sequelize = require("~/services/sequelize.service");

const NhaPhanPhoiModel = sequelize.define(
	"NhaPhanPhoi",
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
		chietkhau: {
			type: DataTypes.FLOAT,
			validate: {
				max: 1,
				min: 0,
			},
			defaultValue: 0,
		},
	},
	{ timestamps: true }
);

module.exports = NhaPhanPhoiModel;
