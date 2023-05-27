const dotenv = require ("dotenv");
dotenv.config()

 const development = {
    mongodb_connection_url: process.env.mongodb_connection_url,
    bycrypt_salt_round: +process.env.bycrypt_salt_round,
    jwt_secret_key: process.env.DEV_JWT_SECRET,
    jwt_expire: process.env.DEV_JWT_EXPIRE,
    port: +process.env.PORT
};

module.exports = development;