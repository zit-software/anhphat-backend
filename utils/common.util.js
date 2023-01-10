const commonUtils = {
	addDays: (currentDate, days) => {
		return currentDate.setDate(
			currentDate.getDate() + days
		);
	},
};

module.exports = commonUtils;
