const config = require("~/config");
const { Sequelize } = require("sequelize");

class DB {
	static async connect() {
		try {
			const sequelize = new Sequelize(
				config.db.database,
				config.db.username,
				config.db.password,
				{
					host: config.db.host,
					dialect: config.db.dialect,
				}
			);
			await sequelize.authenticate();
			console.log(
				"Connection has been established successfully."
			);
			return sequelize;
		} catch (error) {
			console.log(error);
		}
	}
}

module.exports = DB;
