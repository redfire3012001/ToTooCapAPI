const mongoose = require("mongoose");

const OrderItem = new mongoose.Schema(
  {
    quantity: {
      type: Number,
      required: true,
    },
    unit_price: {
      type: Number,
      required: true,
    },
    order_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },
    prouct_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    },
    custom_design_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CustomDesign",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("OrderItem", OrderItem);
