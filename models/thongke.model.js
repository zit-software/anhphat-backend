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
		thu: {
			type: DataTypes.BIGINT,
			allowNull: false,
			validate: {
				min: 0,
			},
		},
		chi: {
			type: DataTypes.BIGINT,
			allowNull: false,
			validate: {
				min: 0,
			},
		},
		conlai: {
			type: DataTypes.BIGINT,
			allowNull: false,
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
		allowNull: false,
	},
});
ThongKeModel.belongsTo(PhieuXuatModel, {
	foreignKey: {
		name: "maphieuxuat",
		allowNull: false,
	},
});
module.exports = ThongKeModel;
