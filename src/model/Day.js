const mongoose = require('mongoose');
const tableSchema = require('./Table').schema

const daySchema = new mongoose.Schema({
    date:{
        type: Date
    },
    tables: [tableSchema]
});
const Day = mongoose.model('Day', daySchema)
module.exports = Day