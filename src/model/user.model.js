const mongoose = require("mongoose")
const validator = require("validator")
const bcrypt = require("bcryptjs")

const userSchema = new mongoose.Schema({
    fullName: {
      type: String,
      required: [true, "Please enter full name."],
      minlength: 3,
      maxlength: 50
    },
    phoneNumber: {
      type: String,
      required: [true, "Please enter phone number"],
    },
    emailAddress: {
      type: String,
      required: [true, "Please enter email address"],
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
      required: [true, "Please provide password."],
      min: 8,
      max: 16,
    },
    confirmPassword: {
      type: String,
      required: true,
      min: 8,
      max: 16,
    },
   
    
    
  })
  
  const User = mongoose.model("User", userSchema);
  userSchema.pre('save', async function () {
    // console.log(this.modifiedPaths());
    // console.log(this.isModified('name'));
    if (!this.isModified('password')) return;
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  });
  
  userSchema.methods.comparePassword = async function (canditatePassword) {
    const isMatch = await bcrypt.compare(canditatePassword, this.password);
    return isMatch;
  };

  // const userLogInSchema = new mongoose.Schema({
  //   name:{
  //     type:String,
  //     required:true,
  //   },
  //   password:{
  //     type:String,
  //     required:true,
  //   }
  // })

  // const UserSignUp = mongoose.model("LogInCollection", userLogInSchema)

  module.exports = User;
  // module.exports = UserSignUp;

