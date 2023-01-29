const mongoose = require("mongoose");

const ItemSchema = mongoose.Schema(
  {
    id: {
      type: String,
      required: [true, "Please mention id"],
    },
    qty: {
      type: String,
      required: [true, "Please mention quantity"],
    },
  },
  {
    timestamps: true,
  }
);

const Item = mongoose.model("Item", ItemSchema);
module.exports = { ItemSchema, Item };
