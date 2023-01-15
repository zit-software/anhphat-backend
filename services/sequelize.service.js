const { Sequelize } = require("sequelize");

const config = require("~/config");

const sequelize = new Sequelize(
	config.db.database,
	config.db.username,
	config.db.password,
	{
		host: config.db.host,
		dialect: config.db.dialect,
	}
);

// Chạy câu lệnh này với mysql
// "SET GLOBAL sql_mode=(SELECT REPLACE(@@sql_mode,'ONLY_FULL_GROUP_BY',''));"

module.exports = sequelize;
