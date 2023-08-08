const sequelize = require("~/services/sequelize.service");
const { DataTypes } = require("sequelize");
const UserModel = require("../models/user.model");
const PhieuNhapQuaKhuyenDungModel = sequelize.define(
	"phieu_nhap_qua_khuyen_dung",
	{
		ma: {
			primaryKey: true,
			type: DataTypes.INTEGER,
			allowNull: false,
			autoIncrement: true,
		},
		ngaynhap: {
			type: DataTypes.DATE,
			allowNull: false,
			defaultValue: new Date(),
		},
		tongsl: {
			type: DataTypes.INTEGER,
			allowNull: false,
			validate: {
				min: 1,
			},
		},
		tongtien: {
			type: DataTypes.BIGINT,
			allowNull: false,
			validate: { min: 0 },
			defaultValue: 0,
		},
	},
	{
		timestamps: true,
		paranoid: true,
		deletedAt: "xoavao",
	},
);
PhieuNhapQuaKhuyenDungModel.belongsTo(UserModel, {
	foreignKey: {
		name: "mauser",
		allowNull: false,
	},
	as: "nguoinhap",
});

module.exports = PhieuNhapQuaKhuyenDungModel;
