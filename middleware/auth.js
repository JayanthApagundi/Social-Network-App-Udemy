const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = function (req, res, next) {
  //get token from the header
  const token = req.header('x-auth-token'); //use this while checking in postman in headers section

  //check if token present/registered or logged in
  if (!token) {
    return res.status(401).json({ msg: ' No token, Authorization Denied ! ' });
  }

  //if token present then verify
  try {
    const decoded = jwt.verify(token, config.get('jwtSecret')); //takes in 2 parameter- token and secret key present in default.json
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};
