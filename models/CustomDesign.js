const mongoose = require("mongoose");

const CustomDesign = new mongoose.Schema(
  {
    design_name: {
      type: String,
      required: true, 
      unique: true, 
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
      required: true, 
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true, 
    },
    base_product_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true, 
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("CustomDesign", CustomDesign);