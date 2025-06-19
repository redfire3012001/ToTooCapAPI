const mongoose = require("mongoose");

const Order = new mongoose.Schema(
  {
    order_date: {
      type: Date,
    },
    status: {
      type: Boolean,
    },
    total_amount: {
      type: Number,
    },
    shipping_address: {
      type: String,
    },
    payment_method: {
      type: String,
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true, 
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", Order);