const jwt = require ("jsonwebtoken")
const config = require ("../config/development")

 function generateToken(user){
  const payload = {_id: user._id}
  const token = jwt.sign(payload, config.jwt_secret_key, { expiresIn: config.jwt_expire });
  return token 
}
 function verifyToken(token){
  return jwt.verify(token, config.jwt_secret_key)
}

module.exports = {generateToken, verifyToken};