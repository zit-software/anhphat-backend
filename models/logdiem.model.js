const { DataTypes } = require("sequelize");

const sequelize = require("~/services/sequelize.service");
const NhaPhanPhoiModel = require("./nhaphanphoi.model");
const UserModel = require("./user.model");

const LogDiemModel = sequelize.define(
	"logdiem",
	{
		ma: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true,
			allowNull: false,
		},
		ghichu: {
			type: DataTypes.TEXT,
			allowNull: false,
		},
		diem: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
	},
	{
		timestamps: true,
	}
);
LogDiemModel.belongsTo(NhaPhanPhoiModel, {
	foreignKey: {
		name: "manpp",
		allowNull: false,
	},
	as: "npp",
});
LogDiemModel.belongsTo(UserModel, {
	foreignKey: {
		name: "mauser",
		allowNull: false,
	},
	as: "user",
});
module.exports = LogDiemModel;
