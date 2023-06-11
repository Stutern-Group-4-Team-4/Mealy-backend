const mongoose = require("mongoose")

const Schema = mongoose.Schema;

const orderSchema = new Schema(
    {
        orderId: {
            type: String,
            required: true,
        },

        items: [
            {
            type: Array,
            required: true,
            },
        ],

        address: {
            type: String,
            required: true,
        },

        phoneno: {
            type: String,
            required: true
        },
        
        totalAmount: {
            type: Number,
            required: true,
        },
        isDelivered: {
			type: Boolean,
			required: true,
			default: false,
		},
        
        orderDate: {
            type: Date,
        },
        
        paidThrough: {
            //card
            type: String,
        }
    }
)


const Orders = mongoose.model("Order", orderSchema)

module.exports = Orders;