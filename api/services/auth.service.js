const jwt = require('jsonwebtoken');
var jwtDecode = require('jwt-decode');

const secret = process.env.NODE_ENV === 'production' ? process.env.JWT_SECRET : 'secret';

const authService = () => {
  const issue = (payload) => jwt.sign(payload, secret, { expiresIn: 86400 });
  const verify = (token, cb) => jwt.verify(token, secret, {}, cb);
  const decodeToken = (token) => jwtDecode(token);
  return {
    issue,
    verify,
    decodeToken
  };
};

module.exports = authService;
