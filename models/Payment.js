const mongoose = require("mongoose");

const Payment = new mongoose.Schema(
  {
    payment_date: {
      type: Date,
    },
    amount: {
      type: Number,
    },
    payment_status: {
      type: Boolean,
    },
    payment_method: {
      type: String,
    },
    order_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },
    
  },
  { timestamps: true }
);

module.exports = mongoose.model("Payment", Payment);