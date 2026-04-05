const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
  try {
    let token = req.header('Authorization');
    if (token) {
      token = token.replace(/^(?:Bearer\s+)+/i, '').replace(/^"|"$/g, '').trim();
    }
    
    if (!token) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({ _id: decoded.id, status: 'active' });

    if (!user) {
      throw new Error();
    }

    req.user = user;
    req.token = token;
    next();
  } catch (error) {
    console.error('Auth Error Details:', error);
    res.status(401).json({ message: 'Please authenticate or your account may be inactive.' });
  }
};

module.exports = auth;
