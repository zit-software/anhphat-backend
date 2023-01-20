const DonViModel = require("~/models/donvi.model");
const QuyCachModel = require("~/models/quycach.model");

const QuyCachUtil = {
	async smallestUnit(malh) {
		try {
			const donviOfLoaiHang =
				await DonViModel.findAll({
					attributes: ["ma", "ten"],
					where: { malh },
				}).then((data) =>
					data.map((e) => e.toJSON())
				);
			for (let donvi of donviOfLoaiHang) {
				const result = await QuyCachModel.findOne({
					where: { madv1: donvi.ma },
				});
				if (!result) return donvi;
			}
			return {};
		} catch (error) {
			console.log(error);
		}
	},
	async convertToSmallestUnit(bigUnitMa, soluong) {
		const bigUnit = await DonViModel.findOne({
			attributes: ["ma", "ten", "malh"],
			where: { ma: bigUnitMa },
		});
		if (!bigUnit) return { soluong: 0, donvi: null };
		const malh = bigUnit.malh;
		const smallestUnit = await this.smallestUnit(malh);
		if (bigUnit.ma === smallestUnit.ma)
			return { soluong: 1, donvi: smallestUnit };
		const quycach = await (
			await QuyCachModel.findOne({
				attributes: ["soluong"],
				where: {
					madv1: bigUnit.ma,
					madv2: smallestUnit.ma,
				},
			})
		).toJSON();
		return {
			soluong: soluong * quycach.soluong,
			donvi: smallestUnit,
		};
	},
};

module.exports = QuyCachUtil;
