const mongoose = require("mongoose")
const Schema = mongoose.Schema;

const trendingSchema = new Schema({
    name: {
        type: String
    },
    orders:{
        type: Number
    },
    views:{
        type: Number
    },
    popularity:{
        type: Number
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
    available:{
        type: Boolean
    },
    image: {
        type: String
    }

})

const trending = mongoose.model("trending", trendingSchema);
module.exports = trending