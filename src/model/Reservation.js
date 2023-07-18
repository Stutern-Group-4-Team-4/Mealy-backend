const mongoose = require("mongoose");
const reservationSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  phoneno: {
    type: String,
  },

  email: {
    type: String,
  },
  date: {
    type: Date
}
})

const Reservation = mongoose.model('Reservation', reservationSchema);

module.exports = Reservation;
