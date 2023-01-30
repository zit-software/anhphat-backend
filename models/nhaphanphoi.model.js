const { DataTypes } = require("sequelize");

const sequelize = require("~/services/sequelize.service");

const NhaPhanPhoiModel = sequelize.define(
	"nhaphanphoi",
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
		sdt: {
			type: DataTypes.TEXT,
			allowNull: true,
		},
		chietkhau: {
			type: DataTypes.FLOAT,
			validate: {
				max: 1,
				min: 0,
			},
			defaultValue: 0,
		},
		tinh: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		diem: {
			type: DataTypes.INTEGER,
			allowNull: false,
			validate: { min: 0 },
			defaultValue: 0,
		},
	},
	{
		timestamps: true,
		paranoid: true,
		deletedAt: "xoavao",
	}
);

module.exports = NhaPhanPhoiModel;
