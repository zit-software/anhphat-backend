#!/usr/bin/env node

/**
 * Module dependencies.
 */
require("module-alias/register");
require("dotenv").config();
const app = require("../app");
const debug = require("debug")("anhphat-backend:server");
const http = require("http");

const sequelize = require("~/services/sequelize.service");
require("~/models/user.model");
require("~/models/loaihang.model");
require("~/models/donvi.model");
require("~/models/quycach.model");
require("~/models/mathang.model");
require("~/models/phieunhap.model");
require("~/models/phieuxuat.model");
require("~/models/khuyenmaigiam.model");
require("~/models/khuyenmaitang.model");
require("~/models/nhaphanphoi.model");
require("~/models/chitietphieunhap.model");
require("~/models/chitietphieuxuat.model");
require("~/models/thongke.model");
async function startServer() {
	/**
	 * Get port from environment and store in Express.
	 */
	const port = normalizePort(process.env.PORT || "3000");
	app.set("port", port);

	/**
	 * Create HTTP server.
	 */

	const server = http.createServer(app);
	try {
		await sequelize.authenticate();

		await sequelize.sync();

		/**
		 * Listen on provided port, on all network interfaces.
		 */
		server.listen(port);
		server.on("error", onError);
		server.on("listening", onListening);
	} catch (error) {
		console.log(error);
	}
	/**
	 * Event listener for HTTP server "listening" event.
	 */

	function onListening() {
		const addr = server.address();
		const bind =
			typeof addr === "string"
				? "pipe " + addr
				: "port " + addr.port;
		debug("Listening on " + bind);
	}

	/**
	 * Event listener for HTTP server "error" event.
	 */

	function onError(error) {
		if (error.syscall !== "listen") {
			throw error;
		}

		const bind =
			typeof port === "string"
				? "Pipe " + port
				: "Port " + port;

		// handle specific listen errors with friendly messages
		switch (error.code) {
			case "EACCES":
				console.error(
					bind + " requires elevated privileges"
				);
				process.exit(1);
				break;
			case "EADDRINUSE":
				console.error(bind + " is already in use");
				process.exit(1);
				break;
			default:
				throw error;
		}
	}
	/**
	 * Normalize a port into a number, string, or false.
	 */

	function normalizePort(val) {
		const port = parseInt(val, 10);

		if (isNaN(port)) {
			// named pipe
			return val;
		}

		if (port >= 0) {
			// port number
			return port;
		}

		return false;
	}
}

startServer();
