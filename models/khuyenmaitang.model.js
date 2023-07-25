const sequelize = require("~/services/sequelize.service");
const { DataTypes } = require("sequelize");

const KhuyenMaiTangModel = sequelize.define(
	"khuyenmaitang",
	{
		ma: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			allowNull: false,
			autoIncrement: true,
		},
		ten: {
			type: DataTypes.TEXT,
			allowNull: false,
		},
		ngaybd: {
			type: DataTypes.DATE,
			defaultValue: new Date(),
		},
		ngaykt: {
			type: DataTypes.DATE,
			defaultValue: new Date(),
			validate: {
				lonHonNgayBatDau(value) {
					if (
						new Date(value) <
						new Date(this.ngaybd)
					) {
						throw new Error(
							"Ngày kết thúc không được sớm hơn ngày bắt đầu",
						);
					}
				},
			},
		},
	},

	{
		timestamps: true,
		paranoid: true,
		deletedAt: "xoavao",
	},
);

module.exports = KhuyenMaiTangModel;
