const { DataTypes } = require("sequelize");

const sequelize = require("~/services/sequelize.service");
const UserModel = require("./user.model");

const PinModel = sequelize.define(
	"pins",
	{
		ma: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true,
			allowNull: false,
		},
		pin: {
			type: DataTypes.TEXT,
			allowNull: false,
			defaultValue: "000000",
		},
	},
	{ timestamps: true }
);

PinModel.belongsTo(UserModel, {
	foreignKey: {
		name: "mauser",
	},
});

module.exports = PinModel;
