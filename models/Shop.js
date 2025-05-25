const mongoose = require("mongoose");

const Shop = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "required"],
      unique: [true, "exist"],
    },
    platform: {
      type: String,
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "required"],
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Shop", Shop);
