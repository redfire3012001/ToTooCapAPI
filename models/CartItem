const mongoose = require("mongoose");

const CartItem = new mongoose.Schema(
  {
    quantity: {
      type: Number,
    },
    unit_price: {
      type: Number,
    },
    cart_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Cart",
      required: [true, "required"],
    },
    product_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: [true, "required"],
    },
    custom_design_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CustomDesign",
      required: [true, "required"],
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("CartItem", CartItem);