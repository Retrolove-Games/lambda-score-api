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

api.corsOrigin("*");

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
api.post(
  "/score/{name}",
  function (request) {
    "use strict";

    const projectSql = SqlString.format(
      "SELECT id, encryption_key FROM projects WHERE name = ?",
      [request.pathParams.name]
    );
    const project = connection.query(projectSql);

    if (project.length !== 1 || !request.body.data) {
      throw new Error("Not found");
    }

    const encryptionKey = project[0].encryption_key;
    const id = project[0].id;
    const decryptedData = CryptoJS.AES.decrypt(
      request.body.data,
      encryptionKey
    ).toString(CryptoJS.enc.Utf8);

    if (decryptedData.length === 0) {
      throw new Error("Unable to decrypt data");
    }

    const score = JSON.parse(decryptedData);
    const date = new Date().toISOString().slice(0, 19).replace("T", " ");
    const insertSql = SqlString.format(
      "INSERT INTO highscores (project_id, nickname, score, source, created_at) VALUES (?, ?, ?, ?, ?)",
      [id, score.nickname, score.score, score.source, date]
    );

    connection.query(insertSql);

    return { status: "OK" };
  },
  {
    success: { code: 200, contentType: "application/json" },
    error: { code: 404, contentType: "application/json" },
  }
);

/**
 * Get scores
 */
api.get(
  "/score/{name}/{number}",
  function (request) {
    "use strict";

    const projectSql = SqlString.format(
      "SELECT id FROM projects WHERE name = ?",
      [request.pathParams.name]
    );
    const project = connection.query(projectSql);

    if (project.length !== 1) {
      throw new Error("Not found");
    }

    const id = project[0].id;

    const scoresSql = SqlString.format(
      "SELECT nickname, score FROM highscores WHERE project_id = ? ORDER BY score DESC LIMIT ?",
      [id, Number(request.pathParams.number)]
    );

    return connection.query(scoresSql);
  },
  {
    success: { code: 200, contentType: "application/json" },
    error: { code: 404, contentType: "application/json" },
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
