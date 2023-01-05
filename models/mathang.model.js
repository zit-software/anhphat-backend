const { DataTypes, Op } = require("sequelize");

const sequelize = require("~/services/sequelize.service");
const DonViModel = require("./donvi.model");
const LoaiHangModel = require("./loaihang.model");

const MatHangModel = sequelize.define(
	"mathang",
	{
		ma: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			allowNull: false,
			autoIncrement: true,
		},
		ngaynhap: {
			type: DataTypes.DATE,
			allowNull: false,
			defaultValue: new Date(),
		},
		hsd: {
			type: DataTypes.DATE,
			allowNull: false,
			validate: {
				lonHonNgayNhap(value) {
					if (Op.gte(value, this.ngaynhap)) {
						throw new Error(
							"Hạn sử dụng không được sớm hơn ngày nhập"
						);
					}
				},
			},
		},
		gianhap: {
			type: DataTypes.BIGINT,
			allowNull: false,
			validate: {
				min: 0,
			},
		},
		giaban: {
			type: DataTypes.BIGINT,
			allowNull: false,
			validate: {
				min: 0,
			},
		},
		daxuat: {
			type: DataTypes.BOOLEAN,
			defaultValue: false,
		},
	},
	{ timestamps: true }
);
MatHangModel.belongsTo(LoaiHangModel, {
	foreignKey: {
		name: "malh",
		allowNull: false,
	},
});
MatHangModel.belongsTo(DonViModel, {
	foreignKey: {
		name: "madv",
		allowNull: false,
	},
});

module.exports = MatHangModel;
