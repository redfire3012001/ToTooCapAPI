const mongoose = require("mongoose");

const OrderItem = new mongoose.Schema(
  {
    quantity: {
      type: Number,
    },
    unit_price: {
      type: Number,
    },
    order_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true, 
    },
    prouct_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true, 
    },
    custom_design_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CustomDesign",
      required: true, 
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("OrderItem", OrderItem);