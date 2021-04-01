const ApiBuilder = require("claudia-api-builder");
const MySql = require("sync-mysql");
const CryptoJS = require("crypto-js");
const SqlString = require("sqlstring");

var api = new ApiBuilder(),
  connection = new MySql({
    host: process.env.RDS_HOST,
    user: process.env.RDS_USER,
    password: process.env.RDS_PASSWORD,
    database: process.env.RDS_DB,
  });

/**
 * Hello page
 */
api.get(
  "/",
  function (request) {
    "use strict";
    return (
      "Nothing here, for games go to http://retrolove.pl." +
      " (" +
      process.env.PROJECT_NAME +
      ")"
    );
  },
  { success: 200 }
);

/**
 * Insert score
 */
api.get(
  "/score/{name}",
  function (request) {
    "use strict";

    var projectSql = SqlString.format('SELECT * FROM projects WHERE name = ?', [request.pathParams.name]);

    return connection.query(projectSql);
  },
  {
    success: { code: 200, contentType: "application/json" },
  }
);

/**
 * Get all projects
 */
api.get(
  "/projects",
  function (request) {
    "use strict";
    return connection.query("SELECT name FROM projects");
  },
  {
    success: { code: 200, contentType: "application/json" },
  }
);

module.exports = api;
