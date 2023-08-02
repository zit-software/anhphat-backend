const sequelize = require("~/services/sequelize.service");
const { DataTypes } = require("sequelize");
const NhaPhanPhoiModel = require("./nhaphanphoi.model");
const UserModel = require("./user.model");
const PhieuXuatQuaKhuyenDungModel = sequelize.define(
	"phieu_xuat_qua_khuyendung",
	{
		ma: {
			primaryKey: true,
			type: DataTypes.INTEGER,
			allowNull: false,
			autoIncrement: true,
		},
		ngayxuat: {
			type: DataTypes.DATE,
			allowNull: false,
			defaultValue: new Date(),
		},
		tongsl: {
			type: DataTypes.INTEGER,
			validate: {
				min: 0,
			},
		},
		tongdiem: {
			type: DataTypes.INTEGER,
			validate: {
				min: 0,
			},
		},
	},
	{ timestamps: true }
);

PhieuXuatQuaKhuyenDungModel.belongsTo(NhaPhanPhoiModel, {
	foreignKey: {
		name: "manpp",
		allowNull: false,
	},
	as: "npp",
});
PhieuXuatQuaKhuyenDungModel.belongsTo(UserModel, {
	foreignKey: {
		name: "mauser",
		allowNull: false,
	},
	as: "nguoinhap",
});

module.exports = PhieuXuatQuaKhuyenDungModel;
