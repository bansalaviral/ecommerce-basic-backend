const jwt = require("jsonwebtoken");
const { User } = require("../models/user.js");

const protect = async (req, res, next) => {
  const tokenExists =
    req.headers.authorization && req.headers.authorization.startsWith("Bearer");

  if (tokenExists) {
    try {
      const token = req.headers.authorization.split(" ")[1];

      const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
      const { id } = decodedToken;
      const user = await User.findById(id).select("-password");

      req.user = user;
      next();
    } catch (err) {
      // 403 - Forbidden
      return res.sendStatus(403);
    }
  } else {
    // 401 - Unauthorized
    return res.sendStatus(401);
  }
};

module.exports = { protect };
