const mongoose = require('mongoose')

const Schema = mongoose.Schema;
const contDishes= new Schema({
   
    name: {
        type: String
    },
    category: {
        type: String
    },
    rating:{
        type: String,
        required:false,
        default: '4.0' 
    },
    comment:{
        type: String,
        required:false
    },
    description: {
        type: String
    },
    price: {
        type: Number
    },
    image: {
        type: String
    },

});

const continentalDishes = mongoose.model('Cont_Dishes', contDishes);

module.exports = continentalDishes;