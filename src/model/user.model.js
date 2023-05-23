import mongoose from mongoose;

const userSchema = new mongoose.Schema({
    fullName: {
      type: String,
      required: true,
    },
    emailAddress: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
      min: 8,
      max: 16,
    },
    confirmPassword: {
      type: String,
      required: true,
      min: 8,
      max: 16,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    code:{
        type: String,
        required: true,
        min: 4,
        max:4
    }
  });
  
  const User = mongoose.model("User", userSchema);

  module.exports = User;