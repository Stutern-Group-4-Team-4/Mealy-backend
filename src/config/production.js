const dotenv = require ("dotenv");
dotenv.config()


const production = {
  mongodb_connection_url: process.env.mongodb_connection_url,
  bycrypt_salt_round: +process.env.bycrypt_salt_round,
  jwt_secret_key: process.env.PRODUCTION_JWT_SECRET,
  PORT: +process.env.PORT,
};

module.exports = production;