const DonViModel = require("~/models/donvi.model");
const QuyCachModel = require("~/models/quycach.model");

const QuyCachUtil = {
	async convertToSmallestUnit(bigUnitMa, soluong) {
		let next = { madv2: bigUnitMa, soluong: 1 };
		let quycach = null;

		do {
			quycach = next;
			next = await QuyCachModel.findOne({
				where: {
					madv1: next.madv2,
				},
			}).then((res) => res?.toJSON());
		} while (next);

		return {
			soluong: soluong * quycach.soluong,
			donvi: await DonViModel.findOne({
				where: { ma: quycach.madv2 },
			}).then((res) => res.toJSON()),
		};
	},
	async convertUnit(bigUnit, smallUnit, soluong) {
		const quycach = await QuyCachModel.findOne({
			where: {
				madv1: bigUnit,
				madv2: smallUnit,
			},
		}).then((data) => data.toJSON());
		const donvinho = await DonViModel.findOne({
			where: {
				ma: quycach.madv2,
			},
		});
		if (!quycach)
			return {
				soluong: 1,
				donvi: {},
			};
		return {
			soluong: soluong * quycach.soluong,
			donvi: donvinho,
		};
	},
};

module.exports = QuyCachUtil;
