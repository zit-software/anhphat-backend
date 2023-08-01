const sequelize = require("~/services/sequelize.service");
const { DataTypes } = require("sequelize");

const QuaKhuyenDungModel = sequelize.define(
	"qua_khuyen_dungs",
	{
		ma: {
			primaryKey: true,
			autoIncrement: true,
			allowNull: false,
			unique: true,
			type: DataTypes.INTEGER,
		},
		diem: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		ten: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		soluong: {
			type: DataTypes.INTEGER,
			allowNull: false,
			defaultValue: 0,
		},
		xuatvao: {
			type: DataTypes.DATE,
			allowNull: true,
			defaultValue: null,
		},
	},
	{ timestamps: true }
);
module.exports = QuaKhuyenDungModel;
