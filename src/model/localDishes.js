const mongoose = require('mongoose')

const Schema = mongoose.Schema;
const locDishes= new Schema({
   
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

const localDishes = mongoose.model('Local_Dishes', locDishes);

module.exports = localDishes;