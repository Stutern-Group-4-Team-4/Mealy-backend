const mongoose = require('mongoose')

const propertySchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        min: 0
    },
    type: {
        type: String,
        enum: ['land', 'house', 'shortlet', 'rent', 'sold']
    },
    location: {
        type: String,
        required: true
    },
    desc: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    beds: {
        type: Number,
        required: true
    },
    baths: {
        type: Number,
        required: true
    },
    featured: {
        type: Boolean,
        default: false
    }
},{timestamps: true})

const properties = mongoose.model('Properties', propertySchema)

module.exports = properties