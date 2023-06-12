const mongoose = require("mongoose");

const restaurantSchema = new mongoose.Schema({
  restaurantName: {
    type: String,
    required: [true, "Please enter the name of the dish"]
  },
  food: [{
    name: {
        type: mongoose.Schema.ObjectId,
        ref: "Dishes",
        required: true
    }
    
}],
drink: [{
    name: {
        type: mongoose.Schema.ObjectId,
        ref: "Drinks",
        required: true
    }
    
}],
  address: {
    type: String,
    required: [true, "Please enter the address of the restaurant"]
  },
  description: {
    type: String,
    required: [true, "Please provide description about the restaurant"]
  },
  contactNumber: {
    type: String,
    required: [true, "Please enter the contact number of the restaurant"]
  },
  image: {
    type: String
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "Users"
  },
  dishes: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "Dishes"
    }
  ]
});

const Restaurant = mongoose.model("Restaurant", restaurantSchema);

module.exports = Restaurant;