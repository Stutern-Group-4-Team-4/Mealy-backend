import dotenv from "dotenv";
dotenv.config()


const production = {
  MONGODB_CONNECTION_URL: process.env.PRODUCTION_MONGODB_CONNECTION_URL,
  PORT: +process.env.PORT,
};

module.exports = production;