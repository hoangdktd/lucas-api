const JWTService = require('../services/auth.service');
const Constant = require('../utils/constant')
// usually: "Authorization: Bearer [token]" or "token: [token]"
module.exports = (req, res, next) => {
  let tokenToVerify;
  console.log('auth,policy');
  tokenToVerify = req.header(Constant.token);
  return JWTService().verify(tokenToVerify, (err, thisToken) => {
    if (err) return res.status(401).json({ err });
    req.token = thisToken;
    return next();
  });
};
