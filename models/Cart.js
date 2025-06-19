const mongoose = require("mongoose");

const Cart = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true, 
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Cart", Cart);