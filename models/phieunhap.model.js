const { DataTypes } = require("sequelize");

const sequelize = require("~/services/sequelize.service");
const NhaPhanPhoiModel = require("./nhaphanphoi.model");
const UserModel = require("./user.model");

const PhieuNhapModel = sequelize.define(
	"phieunhap",
	{
		ma: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true,
			allowNull: false,
		},
		nguon: {
			type: DataTypes.TEXT,
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
			validate: {
				min: 0,
			},
		},
		nguoigiao: {
			type: DataTypes.TEXT,
			allowNull: false,
		},

		daluu: {
			type: DataTypes.BOOLEAN,
			defaultValue: false,
		},
	},
	{
		timestamps: true,
		paranoid: true,
		deletedAt: "xoavao",
	}
);
PhieuNhapModel.belongsTo(UserModel, {
	foreignKey: {
		name: "mauser",
		allowNull: false,
	},
	as: "nguoinhap",
});
PhieuNhapModel.belongsTo(NhaPhanPhoiModel, {
	foreignKey: {
		name: "manpp",
	},
	as: "npp",
});

module.exports = PhieuNhapModel;
