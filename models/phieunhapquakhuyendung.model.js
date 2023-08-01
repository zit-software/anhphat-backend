const sequelize = require("~/services/sequelize.service");
const { DataTypes } = require("sequelize");
const PhieuNhapQuaKhuyenDungModel = sequelize.define(
	"phieu_nhap_qua_khuyen_dung",
	{
		ma: {
			primaryKey: true,
			type: DataTypes.INTEGER,
			allowNull: false,
			autoIncrement: true,
		},
	}
);
