const bcrypt = require("bcrypt")
const { BCRYPT_SALT } = 10;

class passwordMiddleware {
    static hashPassword( password ) {
        return bcrypt.hashSync( password, BCRYPT_SALT )
    }

    static compareHash( password, confirmPassword ) {
        return bcrypt.compareSync( password, confirmPassword )
    }
}

module.exports = passwordMiddleware