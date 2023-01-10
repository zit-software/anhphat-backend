const config = {
	db: {
		host: process.env.DB_HOST,
		dialect: process.env.DB_DIALECT,
		port: process.env.DB_PORT,
		username: process.env.DB_USERNAME,
		password: process.env.DB_PASSWORD,
		database: process.env.DB_DATABASE,
	},
	fontend: {
		origin: process.env.FRONTEND_ORIGIN || "*",
	},
	security: {
		jwtSecret: process.env.JWT_SECRET || "JWT_SECRET",
	},
};

module.exports = config;
