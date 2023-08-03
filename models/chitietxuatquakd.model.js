const sequelize = require("~/services/sequelize.service");
const { DataTypes } = require("sequelize");
const PhieuXuatQuaKhuyenDungModel = require("./phieuxuatquakhuyendung.model");
const QuaKhuyenDungModel = require("./quakhuyendung.model");
const ChiTietXuatQuaKD = sequelize.define(
	"chitiet_xuat_qua_khuyendung",
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
	},
);

ChiTietXuatQuaKD.belongsTo(PhieuXuatQuaKhuyenDungModel, {
	foreignKey: {
		name: "maPhieuXuatQuaKD",
		allowNull: false,
	},
});

ChiTietXuatQuaKD.belongsTo(QuaKhuyenDungModel, {
	foreignKey: {
		name: "maQuaKD",
		allowNull: false,
	},
	as: "qua",
});
module.exports = ChiTietXuatQuaKD;
