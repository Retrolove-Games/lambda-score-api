const ApiBuilder = require("claudia-api-builder");
const MySql = require("sync-mysql");
const CryptoJS = require("crypto-js");

var api = new ApiBuilder();

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

module.exports = api;
