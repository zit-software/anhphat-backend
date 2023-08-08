const sequelize = require("~/services/sequelize.service");
const { DataTypes } = require("sequelize");
const QuaKhuyenDungModel = require("../models/quakhuyendung.model");
const PhieuNhapQuaKhuyenDungModel = require("./phieunhapquakhuyendung.model");
const ChiTietNhapQuaKhuyenDung = sequelize.define(
	"chitiet_nhap_qua_khuyendung",
	{
		ma: {
			primaryKey: true,
			allowNull: false,
			autoIncrement: true,
			type: DataTypes.INTEGER,
		},
		soluong: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		gia: {
			type: DataTypes.INTEGER,
			allowNull: false,
			defaultValue: 0,
		},
	},
);

ChiTietNhapQuaKhuyenDung.belongsTo(QuaKhuyenDungModel, {
	foreignKey: {
		name: "maQuaKD",
		allowNull: false,
	},
	as: "qua",
});

ChiTietNhapQuaKhuyenDung.belongsTo(
	PhieuNhapQuaKhuyenDungModel,
	{
		foreignKey: {
			name: "maPhieuNhapQuaKD",
			allowNull: false,
		},
	},
);

module.exports = ChiTietNhapQuaKhuyenDung;
