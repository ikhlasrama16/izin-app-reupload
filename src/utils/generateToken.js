const jwt = require('jsonwebtoken');

module.exports = (user) => {
  const payload = { id: user._id, role: user.role };
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.TOKEN_EXPIRES });
};
