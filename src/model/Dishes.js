const mongoose = require('mongoose')

const Schema = mongoose.Schema;



const Dish= new Schema({
    name:{
        type: String,
        required: true
    },
    reviews: [{
        name:{
            type: String,
            required:[true,'Please provide a name']
        },
        rating:{
            type: String,
            required:true 
        },
        comment:{
            type: String,
            required:[true,'Please provide a comment']
        },
        user:{
            type: mongoose.Schema.Types.ObjectId,
            required:[true,'Please provide a name'],
            ref:"User"
        }
    }],
    title: {
        type: String
    },
    numReview:{
        type: Number,
        default: 0
    },
    rating:{
        type: String,
        required:false,
        default:'4.0'
    },
    available: {
        type: Boolean,
        default: false
    },

    category: {
        type: String,
        required: true
    },
   
    description: {
        type: String
    },
    price: {
        type: Number
    },
    image: {
        type: String,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, 'Please provide a name'],
        ref: "User"
    }

});



const Dishes = mongoose.model('Dishes', Dish);

module.exports = Dishes;