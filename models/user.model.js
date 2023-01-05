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
		laAdmin: {
			type: DataTypes.BOOLEAN,
			defaultValue: false,
		},
	},
	{ timestamps: true }
);

module.exports = UserModel;
