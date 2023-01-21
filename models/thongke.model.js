const { DataTypes } = require("sequelize");

const sequelize = require("~/services/sequelize.service");
const PhieuNhapModel = require("./phieunhap.model");
const PhieuXuatModel = require("./phieuxuat.model");

const ThongKeModel = sequelize.define(
	"thongke",
	{
		ma: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true,
			allowNull: false,
		},
		ngay: {
			type: DataTypes.DATE,
			allowNull: false,
			defaultValue: new Date(),
		},
		thu: {
			type: DataTypes.BIGINT,
			validate: {
				min: 0,
			},
			defaultValue: 0,
		},
		chi: {
			type: DataTypes.BIGINT,
			validate: {
				min: 0,
			},
			defaultValue: 0,
		},
		conlai: {
			type: DataTypes.BIGINT,
			allowNull: false,
			defaultValue: 0,
		},
		xoa: {
			type: DataTypes.DATE,
			defaultValue: null,
		},
	},
	{ timestamps: true }
);
ThongKeModel.belongsTo(PhieuNhapModel, {
	foreignKey: {
		name: "maphieunhap",
	},
});
ThongKeModel.belongsTo(PhieuXuatModel, {
	foreignKey: {
		name: "maphieuxuat",
	},
});
module.exports = ThongKeModel;
