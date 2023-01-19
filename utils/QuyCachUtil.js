const DonViModel = require("~/models/donvi.model");
const QuyCachModel = require("~/models/quycach.model");

const QuyCachUtil = {
	async smallestUnit(malh) {
		try {
			const donviOfLoaiHang =
				await DonViModel.findAll({
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
			where: { ma: bigUnitMa },
		});
		if (!bigUnit) return 0;
		const malh = bigUnit.malh;
		const smallestUnit = await this.smallestUnit(malh);
		const quycach = await (
			await QuyCachModel.findOne({
				where: {
					madv1: bigUnit.ma,
					madv2: smallestUnit.ma,
				},
			})
		).toJSON();
		return soluong * quycach.soluong;
	},
};

module.exports = QuyCachUtil;
