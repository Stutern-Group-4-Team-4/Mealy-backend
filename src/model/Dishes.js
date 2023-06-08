const mongoose = require('mongoose')

const Schema = mongoose.Schema;

const restaurantSchema = new Schema({
    restaurant: {
        type: String,
        required: [true, 'Please provide a name']
    },
    food: [{
        name: {
            type: String,
            required: true
        },
        price: {
            type: Number,
            required: true
        }
    }],
    drink: [{
        name: {
            type: String,
            required: true
        },
        price: {
            type: Number,
            required: true
        }
    }],
    imageUrl: {
        type: [String],
        required: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, 'Please provide a name'],
        ref: "User"
    }
});

const Dish= new Schema({
    name:[restaurantSchema],
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
    item: {
        type: String
    },
    rating:{
        type: String,
        required:false,
        default:'4.0'
    },
   
    description: {
        type: String
    },
    price: {
        type: Number
    },
    image: {
        type: String,
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, 'Please provide a name'],
        ref: "User"
    }

});



const Dishes = mongoose.model('Dishes', Dish);

module.exports = Dishes;