const { DataTypes } = require("sequelize");

const sequelize = require("~/services/sequelize.service");

const UserModel = sequelize.define(
	"users",
	{
		ma: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true,
			allowNull: false,
		},
		mk: {
			type: DataTypes.TEXT,
			allowNull: false,
		},
		ten: {
			type: DataTypes.TEXT,
			allowNull: false,
		},
		sdt: {
			type: DataTypes.STRING,
		},
		laAdmin: {
			type: DataTypes.BOOLEAN,
			defaultValue: false,
		},
	},
	{ initialAutoIncrement: 1000, timestamps: true },
);

module.exports = UserModel;
