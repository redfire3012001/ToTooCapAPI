const mongoose = require("mongoose");

const Shop = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true, 
    },
    platform: {
      type: String,
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true, 
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Shop", Shop);
