const development = require("./development");
const production = require("./production");
require("dotenv").config();


const environment = process.env.NODE_ENV;

GOOGLE_CLIENT_ID= '635376229474-0qtdi55p0co9qch2d20toahvmq60928g.apps.googleusercontent.com'
GOOGLE_CLIENT_SECRET= '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'


FACEBOOK_CLIENT_ID = '715232830405973'
FACEBOOK_SECRET_KEY = '20b1c39c30b0d83f6bef5f01a4517272'

console.log("Sever set up to", environment, "!!!");

const config =
  environment === "development"
    ? { ...development }
    : environment === "staging"
    ? { ...staging }
    : { ...production };

    module.exports = config;