const mongoose = require('mongoose');
const reservationSchema =require('./Reservation').schema;

const tableSchema = new mongoose.Schema({
    name: {
        type: String
    },
    capacity: {
        type: Number
    },
    isAvailable:{
        type: Boolean
    },
    location:{
        type: String
    },
    reservation:{
        required: false,
        type: [reservationSchema]
    }
    
});

const Table = mongoose.model('Table', tableSchema);

module.exports = Table