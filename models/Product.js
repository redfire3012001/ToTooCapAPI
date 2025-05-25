const mongoose = require("mongoose");

const Product = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "required"],
      unique: [true, "exist"],
    },
    description: {
      type: String,
    },
    price: {
      type: Number,
    },
    stock_quantity: {
      type: Number,
    },
    image_url: {
      type: String,
    },
    category_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "required"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", Product);
