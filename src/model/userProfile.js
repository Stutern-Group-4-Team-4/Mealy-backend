const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const userProfileSchema = new Schema({
    userProfile: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
        required: true
    },
    profilePic: { 
        type: String
    }
})