const mongoose = require("mongoose")
const Schema = mongoose.Schema


const tokenSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Users'
    },
    token: {
      type: String,
      required: true
    },
    createdAt: {
      type: Date,
      required: true
    }
  }
)
const Token = mongoose.model('Token', tokenSchema)
module.exports = Token;