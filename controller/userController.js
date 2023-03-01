const { User } = require("../models/user.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const registerUser = async (req, res) => {
  const { email, name, password } = req.body;

  //check if all details are entered
  if (!email || !name || !password) {
    return res.status(400).json({
      message: "enter all details",
    });
  }
  const userExists = await User.findOne({ email });
  if (userExists) {
    return res.status(401).json({
      message: "User already exists",
    });
  }
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(password, salt, async (err, hash) => {
      // Store hash in your password DB.
      const user = await User.create({
        name,
        email,
        password: hash,
      });

      if (user) {
        return res.status(201).json({
          _id: user.id,
          name: user.name,
          email: user.email,
          token: generateToken(user._id),
        });
      } else
        return res.status(401).json({
          message: "Invalid User Data",
        });
    });
  });
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (user && (await bcrypt.compare(password, user.password))) {
    return res.status(200).json({
      id: user.id,
      email: user.email,
      name: user.name,
      token: generateToken(user._id),
    });
  } else {
    return res.status(400).json({
      message: "Invalid User credentials",
    });
  }
};

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

module.exports = { registerUser, loginUser };
