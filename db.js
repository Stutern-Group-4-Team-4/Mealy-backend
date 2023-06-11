const mongoose = require('mongoose');

const mongoURL = 'mongodb+srv://dejioyelakin:Possibility2+@cluster0.vccc0w4.mongodb.net/MEALY?retryWrites=true&w=majority'

mongoose.connect(mongoURL, {useUnifiedTopology:true, useNewUrlParser:true});

const db = mongoose.connection;

db.on('connected', ()=>{
    console.log('Database connection established!')
})

db.on('error', ()=>{
    console.log('Mongo connection error')
})

module.exports = mongoose
