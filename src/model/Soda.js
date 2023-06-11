const mongoose = require('mongoose')
const Schema = mongoose.Schema

const sodaSchema = new Schema({
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

const soda = mongoose.model("soda", sodaSchema);
module.exports = soda;