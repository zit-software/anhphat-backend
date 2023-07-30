const { DataTypes } = require("sequelize");
const sequelize = require("~/services/sequelize.service");
const DonViModel = require("./donvi.model");
const KhuyenMaiTangModel = require("./khuyenmaitang.model");
const LoaiHangModel = require("./loaihang.model");

const ChiTietKMT = sequelize.define(
	"chitietkmt",
	{
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
	},
	{
		timestamps: true,
		paranoid: true,
		deletedAt: "xoavao",
	},
);
ChiTietKMT.belongsTo(DonViModel, {
	foreignKey: {
		name: "madvmua",
		allowNull: false,
	},
	as: "dvmua",
});
ChiTietKMT.belongsTo(DonViModel, {
	foreignKey: {
		name: "madvtang",
		allowNull: false,
	},
	as: "dvtang",
});

ChiTietKMT.belongsTo(KhuyenMaiTangModel, {
	foreignKey: {
		name: "makmt",
		allowNull: false,
	},
});

ChiTietKMT.belongsTo(LoaiHangModel, {
	foreignKey: {
		name: "malh",
		allowNull: false,
	},
	as: "lh",
});

module.exports = ChiTietKMT;
