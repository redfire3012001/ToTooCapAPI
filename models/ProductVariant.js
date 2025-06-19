const mongoose = require("mongoose");

const ProductVariant = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true, 
    },
    platform: {
      type: String,
    },
    shop_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Shop",
      required: true, 
    },
    product_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true, 
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ProductVariant", ProductVariant);
