const mongoose = require("mongoose")
const validator = require("validator")


const userSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true,
      trim: true,
      min: 3,
      max: 100
    },
    phoneno: {
      type: String,
      required: true,
      

    },
    
    email: {
      type: String,
      required: true,
      trim: true,
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
      required: true,
      min: 8,
      max: 16,
    },
  
    isVerified: {
      type: Boolean,
      default: false,
    },
    role: {
      type: String,
      trim: true,
      enum: ["user", "admin"],
      default: "user"
 },
 address: {
  type: String
},
 cart: [
  {
      type: Schema.Types.ObjectId,
      ref: "Cart"
  }
],

order: [
  {
      type: Schema.Types.ObjectId,
      ref: "Order"
  },
],

    verifyEmailToken: String,
    verifyEmailTokenExpire: Date,
    resetPasswordToken: String,
    resetPasswordExpire: Date,
  },
   
 
 {
  timestamps: true
 }  
  )

  const User = mongoose.model('Users', userSchema)
  module.exports = User

  

  
  

