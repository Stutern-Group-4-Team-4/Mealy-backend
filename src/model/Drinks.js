const mongoose = require('mongoose')
const Schema = mongoose.Schema

const drinksSchema = new Schema({
    name:{
        type: String
    },
    category: {
        type: String
    },
    available: {
        type: Boolean,
        default: false
    },

    description: {
        type: String
    },
    price: {
        type: Number
    },
    image: {
        type: String
    }

})

const Drinks = mongoose.model("Drinks", drinksSchema);
module.exports = Drinks;