const express = require("express");
const path = require("path");
const logger = require("morgan");
const bodyParser = require("body-parser");
const cors = require("cors");
const { queryParser } = require("express-query-parser");

const config = require("~/config");

const app = express();

app.use(
	queryParser({
		parseNull: true,
		parseUndefined: true,
		parseBoolean: true,
		parseNumber: true,
	}),
);
app.use(bodyParser.json());
app.use(
	cors({
		origin: config.fontend.origin,
		optionsSuccessStatus: 200,
	}),
);

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use("/", require("~/routes"));

module.exports = app;
