const mongoose = require ("mongoose");

const User = new mongoose.Schema(
    {
        username:{
            type: String,
            required: true, 
            unique: true, 
        },
        email:{
            type: String,
            required: true,
            unique: true,
        },
        password:{
            type: String,
            required: true, 
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