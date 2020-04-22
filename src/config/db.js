const mysql = require("mysql");
const dbConfig = require("../config/db.config.js");
var connection = mysql.createConnection({
  host: dbConfig.HOST,
  user: dbConfig.USER,
  password: dbConfig.PASS,
  database: dbConfig.DB,
});

connection.connect(function (error) {
  if (error) throw error;
});
module.exports = connection;
