const sequelize = require("~/services/sequelize.service");
const { DataTypes, Op } = require("sequelize");
const LoaiHangModel = require("./loaihang.model");

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
		soluongmua: {
			type: DataTypes.INTEGER,
			validate: {
				min: 0,
			},
			defaultValue: 0,
		},
		soluongtang: {
			type: DataTypes.INTEGER,
			validate: {
				min: 1,
			},
			defaultValue: 1,
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
					if (Op.gte(value, this.ngaynhap)) {
						throw new Error(
							"Ngày kết thúc không được sớm hơn ngày bắt đầu"
						);
					}
				},
			},
		},
	},

	{ timestamps: true }
);

KhuyenMaiTangModel.belongsTo(LoaiHangModel, {
	foreignKey: {
		name: "malh",
		allowNull: false,
	},
});

module.exports = KhuyenMaiTangModel;
