const mongoose = require("mongoose");

const ProductVariant = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "required"],
      unique: [true, "exist"],
    },
    platform: {
      type: String,
    },
    shop_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Shop",
      required: [true, "required"],
    },
    product_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: [true, "required"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ProductVariant", ProductVariant);
