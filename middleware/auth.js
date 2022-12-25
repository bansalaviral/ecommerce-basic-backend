const jwt = require("jsonwebtoken");
const { User } = require("../models/user.js");

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      const user = await User.findById(decoded.id).select("-password");

      req.user = user;

      next();
    } catch (err) {
      return res.status(401).json({
        error: "Not Authorized!",
      });
    }
  }

  if (!token) {
    return res.status(401).json({
      error: "Not Authorized, no token!",
    });
  }
};

module.exports = { protect };
