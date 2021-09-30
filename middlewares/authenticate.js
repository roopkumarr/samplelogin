const jwt = require('jsonwebtoken');

module.exports.auth = (req, res, next) => {
  try {
    const decoded = jwt.verify(
      req.headers.authorization,
      process.env.JWTPRIVATEKEY,
    );
    req.userData = decoded;
    // console.log(req.userData);
    next();
  } catch (err) {
    res.status(200).json({
      message: 'auth failed',
      statusCode: 401,
      data: null,
      error: 'Auth Failed',
    });
  }
};

module.exports.adminauth = (req, res, next) => {
  if (req.userData.role == '1' || req.userData.role == '2' || req.userData.role == '3') {
    next();
  } else {
    res.status(200).json({
      message: 'auth failed',
      statusCode: 401,
      data: null,
      error: 'Auth Failed',
    });
  }
};