const { DataTypes } = require("sequelize");

const sequelize = require("~/services/sequelize.service");
const KhuyenMaiGiamModel = require("./khuyenmaigiam.model");
const KhuyenMaiTangModel = require("./khuyenmaitang.model");
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
		istrahang: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
			default: false,
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
PhieuXuatModel.belongsTo(UserModel, {
	foreignKey: {
		name: "mauser",
		allowNull: false,
	},
	as: "nguoinhap",
});
PhieuXuatModel.belongsTo(NhaPhanPhoiModel, {
	foreignKey: {
		name: "manpp",
		allowNull: false,
	},
	as: "npp",
});
PhieuXuatModel.belongsTo(KhuyenMaiGiamModel, {
	foreignKey: {
		name: "makmg",
	},
	as: "kmg",
});
PhieuXuatModel.belongsTo(KhuyenMaiTangModel, {
	foreignKey: {
		name: "makmt",
	},
	as: "kmt",
});
module.exports = PhieuXuatModel;
