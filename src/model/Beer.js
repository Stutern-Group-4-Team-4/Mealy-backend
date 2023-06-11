const mongoose = require('mongoose')
const Schema = mongoose.Schema

const beerSchema = new Schema({
    name:{
        type: String
    },
    category: {
        type: String
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

const beer = mongoose.model("beer", beerSchema);
module.exports = beer;