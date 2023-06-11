const mongoose = require('mongoose')
const Schema = mongoose.Schema

const wineSchema = new Schema({
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

const wine = mongoose.model("wine", wineSchema);
module.exports = wine;