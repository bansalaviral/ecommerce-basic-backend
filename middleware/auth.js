const jwt = require("jsonwebtoken");
const { User } = require("../models/user.js");

const protect = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = headers.authorization.split("")[1];

      //verify token

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      //get user from token
      req.user = await User.findById(decoded.id).select("-password");
      next();
    } catch (error) {
      return res.status(401).json({
        error: "not authorized",
      });
    }
    if (!token) {
      return res.status(401).json({
        error: "not authorized, no token",
      });
    }
  }
};

module.exports = { protect };
