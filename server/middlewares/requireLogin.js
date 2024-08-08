// middlewares/requireLogin.js
const jwt = require('jsonwebtoken');
const { SECRET_KEY } = require("../config/keys");

const requireLogin = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).json({ error: "You must be logged in." });
  }

  const token = authorization.replace("Bearer ", "");

  jwt.verify(token, SECRET_KEY, (err, payload) => {
    if (err) {
      return res.status(401).json({ error: "You must be logged in." });
    }

    const { userId } = payload;
    req.user = userId;
    next();
  });
};

module.exports = { requireLogin };
