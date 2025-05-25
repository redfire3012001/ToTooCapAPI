const mongoose = require ("mongoose");

const User = new mongoose.Schema(
    {
        username:{
            type: String,
            required: [true, "required"],
            unique: [true, "exist"],
        },
        email:{
            type: String,
        },
        password:{
            type: String,
            required: [true, "required"]
        },
        phone:{
            type : Number
        },
        address:{
            type : String
        },
        role:{
            type: String,
            enum: ["customer", "admin", "shop"],
            default: "customer"
        },
    },
    {timestamps: true}
);

module.exports = mongoose.model("User", User);