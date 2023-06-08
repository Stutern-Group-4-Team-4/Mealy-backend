const mongoose = require("mongoose")

const Schema = mongoose.Schema;

const Orders = new Schema({
    userId: {
        type: String,
        required: true
    },
    userCartId: {
        type: String,
        required: true
    },
    deliveryAdd: {
        type: String
    },
    cartAmt: {
        type: Number
    },
    discount: {
        type: Number,
        default: 0
    },
    promoCode: {
        type: String
    },
    paymentMode: {
        type: String
    },
    isPaid:{
        type: Boolean,
        default: false
    },
    transactionId:{
        type: String
    },
    isDelivered: {
        type: Boolean,
        default: false
    }
});