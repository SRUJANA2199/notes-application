const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  try {
    // Get token from header
    const token = req.header("Authorization")?.split(" ")[1]; // "Bearer <token>"
    if (!token) return res.status(401).json({ msg: "No token, authorization denied" });

    // Verify token
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
      if (err) return res.status(401).json({ msg: "Authorization is not valid." });

      req.user = user; // attach user payload to request
      next();
    });

  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
};

module.exports = auth;
