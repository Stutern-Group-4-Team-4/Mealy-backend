const mongoose = require("mongoose")
const validator = require("validator")
const crypto = require ("crypto");

const userSchema = new mongoose.Schema({
    name: {
      type: String,
      required: [true],
      min: 3,
      max: 100
    },
    phonenumber: {
      type: String,
      required: [true],
    },
    email: {
      type: String,
      required: [true],
      unique: true,
      lowercase: true,
      immutable: true,
      validate: {
        validator: validator.isEmail,
        message: 'Please provide valid email',
      }
      }, 
    password: {
      type: String,
      required: [true],
      min: 8,
      max: 16,
    },
  
    isVerified: {
      type: Boolean,
      default: false,
    },
    verifyEmailToken: String,
    verifyEmailTokenExpire: Date,
    resetPasswordToken: String,
    resetPasswordExpire: Date,
  },
   
 
 {
  timestamps: true
 }  
  )
  
  


  userSchema.methods.getResetPasswordToken = function () {
    // Generate Token
    const resetToken = crypto.randomBytes(20).toString('hex');
    // Hash token and set to resetPasswordToken field
    this.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  
    // Set expire
    this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;
    return resetToken

  }

  const User = mongoose.model("user", userSchema);
  
  
  module.exports =  User;

  

  
  

