const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Car = require('./car').schema;

const mechanicSchema = new Schema(
  {
    userId: {
      type: String,
    },
    rating: {
      type: String,
    },
    appointmentsDone: {
      type: Number,
    },
    desciption: String,
    address: String,
    preferedCars: [Car],
  },
  {
    timestamps: true,
  }
);

const Mechanic = mongoose.model('Mechanic', mechanicSchema);

module.exports = Mechanic;
