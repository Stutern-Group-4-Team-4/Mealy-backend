const mongoose = require("mongoose");

const userOTPverificationSchema = mongoose.Schema({
    userId: String,
    otp: String,
    createdAt: Date,
    expiresAt: Date,
})

const userOTPverification = mongoose.model(
    "userOTPverification",
    userOTPverificationSchema

)

module.exports = userOTPverification;