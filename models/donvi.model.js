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
		diem: {
			type: DataTypes.FLOAT,
			allowNull: false,
			defaultValue: 1,
			validate: {
				min: 0,
			},
		},
	},
	{ timestamps: true },
);
DonViModel.belongsTo(LoaiHangModel, {
	foreignKey: {
		name: "malh",
		allowNull: false,
	},
});

module.exports = DonViModel;
