const { DataTypes } = require("sequelize");

const sequelize = require("~/services/sequelize.service");
const LoaiHangModel = require("./loaihang.model");

const DonViModel = sequelize.define(
	"donvi",
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
DonViModel.belongsTo(LoaiHangModel, {
	foreignKey: {
		name: "malh",
		allowNull: false,
	},
});

module.exports = DonViModel;
