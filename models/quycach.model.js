const { DataTypes } = require("sequelize");

const sequelize = require("~/services/sequelize.service");
const DonViModel = require("./donvi.model");

const QuyCachModel = sequelize.define(
	"quycach",
	{
		ma: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true,
			allowNull: false,
		},
		soluong: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
	},
	{ timestamps: true }
);
QuyCachModel.belongsTo(DonViModel, {
	foreignKey: {
		name: "madv1",
		allowNull: false,
	},
});
QuyCachModel.belongsTo(DonViModel, {
	foreignKey: {
		name: "madv2",
		allowNull: false,
	},
});

module.exports = QuyCachModel;
