const mongoose = require("mongoose");
const { ItemSchema } = require("./item.js");

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter name"],
  },
  email: {
    type: String,
    required: [true, "Please enter email"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Please enter password"],
  },
  cart: [
    {
      type: ItemSchema,
    },
  ],
});

const User = mongoose.model("User", userSchema);
module.exports = { User };
