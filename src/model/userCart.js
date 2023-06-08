const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const user_Cart = new Schema({
    userId: {
        type: String
    },
    totalQty: {
        type: Number
    },
    totalPrice: {
        type: Number
    },
    data: [{
        itemId: String,
        itemQty: Number
   }]
});

const userCart = mongoose.model('userCart', user_Cart);

module.exports = userCart;