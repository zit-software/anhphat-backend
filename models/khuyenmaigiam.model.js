const sequelize = require("~/services/sequelize.service");
const { DataTypes } = require("sequelize");
const LoaiHangModel = require("./loaihang.model");

const KhuyenMaiGiamModel = sequelize.define(
	"khuyenmaigiam",
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
		tile: {
			type: DataTypes.FLOAT,
			validate: {
				min: 0,
				max: 1,
			},
			defaultValue: 0,
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
							"Ngày kết thúc không được sớm hơn ngày bắt đầu"
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
	}
);

KhuyenMaiGiamModel.belongsTo(LoaiHangModel, {
	foreignKey: {
		name: "malh",
		allowNull: false,
	},
});

module.exports = KhuyenMaiGiamModel;
