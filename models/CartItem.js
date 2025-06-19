const mongoose = require("mongoose");

const CartItem = new mongoose.Schema(
  {
    quantity: {
      type: Number,
      required: true,
    },
    unit_price: {
      type: Number,
      required: true,
    },
    cart_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Cart",
      required: true,
    },
    product_id: {
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

CartItem.index({ cart_id: 1, product_id: 1 }, { unique: true, sparse: true });
CartItem.index({ cart_id: 1, custom_design_id: 1 }, { unique: true, sparse: true });

module.exports = mongoose.model("CartItem", CartItem);
