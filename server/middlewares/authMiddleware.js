const jwt = require('jsonwebtoken');
const Admin = require('../models/admin.model');

const isAuth = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(401).send({ message: 'Auth failed', success: false });
      } else {
        req.body.userId = decoded._id;
        req.userType = decoded.userType;
        req.token = token;
        next();
      }
    });
  } catch (error) {
    return res.status(401).send({ message: 'Auth failed', success: false });
  }
};

// admin checker
const isAdmin = async (req, res, next) => {
  const token = req.cookies.jwt;
  if (!token) {
    return res.status(401).json(error('TOKEN_EXPIRED'));
  }

  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const user = await Admin.findOne({
      _id: decodedToken._id,
      'tokens.token': token,
    });
    if (!user) {
      return res.status(404).json({ message: 'unauthorize' });
    }

    req.user = user;
    req.body.userId = decodedToken._id;
    req.token = token;
    req.isAdmin = true;
    req.userType = decodedToken.userType;
    next();
  } catch (err) {
    console.log(err);
    return res.status(404).json({ message: 'unauthorize' });
  }
};

module.exports = { isAdmin, isAuth };
