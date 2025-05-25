const mongoose = require("mongoose");

const CustomDesign = new mongoose.Schema(
  {
    design_name: {
      type: String,
      required: [true, "required"],
      unique: [true, "exist"],
    },
    color: {
      type: String,
    },
    text: {
      type: String,
    },
    image_url: {
      type: String,
    },
    status: {
      type: Boolean,
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "required"],
    },
    base_product_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: [true, "required"],
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("CustomDesign", CustomDesign);