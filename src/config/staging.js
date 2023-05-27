const dotenv = require ("dotenv");
dotenv.config()

 const staging = {
    mongodb_connection_url: process.env.STAGING_MONGODB_CONNECTION_URL,
    port: +process.env.PORT
};

module.exports = staging;