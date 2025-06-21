const mongoose = require("mongoose");

const Order = new mongoose.Schema(
  {
    order_date: {
      type: Date,
      required: true,
      default: () => {
        const now = new Date();
        now.setDate(now.getDate() + 1);
        return now;
      },
    },
    status: {
      type: String,
      enum: ["Done", "Processing", "Cancel"],
      default: "Processing",
      required: true,
    },
    total_amount: {
      type: Number,
      required: true,
    },
    shipping_address: {
      type: String,
      required: true,
    },
    payment_method: {
      type: String,
      enum: ["Online", "Physical"],
      default: "Online",
      required: true,
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
