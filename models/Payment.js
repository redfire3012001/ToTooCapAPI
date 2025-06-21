const mongoose = require("mongoose");

const Payment = new mongoose.Schema(
  {
    payment_date: {
      type: Date,
    },
    amount: {
      type: Number,
      required: true,
    },
    payment_status: {
      type: String,
      enum: ["Processing", "Done", "Cancel"],
      default: "Processing",
      required: true,
    },
    payment_method: {
      type: String,
      enum: ["Online", "Physical"],
      default: "Online",
      required: true,
    },
    order_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
      unique: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Payment", Payment);
