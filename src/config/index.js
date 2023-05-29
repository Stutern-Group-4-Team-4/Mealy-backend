const development = require("./development");
const production = require("./production");
require("dotenv").config();
const Sib = require('sib-api-v3-sdk');

const environment = process.env.NODE_ENV;

console.log("Sever set up to", environment, "!!!");

const config =
  environment === "development"
    ? { ...development }
    : environment === "staging"
    ? { ...staging }
    : { ...production };

    module.exports = config;