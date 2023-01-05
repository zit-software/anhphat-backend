const { DataTypes } = require("sequelize");

const sequelize = require("~/services/sequelize.service");
const KhuyenMaiGiamModel = require("./khuyenmaigiam.model");
const NhaPhanPhoiModel = require("./nhaphanphoi.model");
const UserModel = require("./user.model");

const PhieuXuatModel = sequelize.define(
	"phieuxuat",
	{
		ma: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true,
			allowNull: false,
		},
		ngayxuat: {
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
		xoavao: {
			type: DataTypes.DATE,
			defaultValue: null,
		},
	},
	{ timestamps: true }
);
PhieuXuatModel.belongsTo(UserModel, {
	foreignKey: {
		name: "mauser",
		allowNull: false,
	},
});
PhieuXuatModel.belongsTo(NhaPhanPhoiModel, {
	foreignKey: {
		name: "manpp",
		allowNull: false,
	},
});
PhieuXuatModel.belongsTo(KhuyenMaiGiamModel, {
	foreignKey: {
		name: "makmg",
	},
});
module.exports = PhieuXuatModel;
