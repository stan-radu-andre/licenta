const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const mechanicSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    preferedCars: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Car',
      },
    ],
    appointments: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Appointment',
      },
    ],
    body: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Mechanic = mongoose.model('Mechanic', mechanicSchema);

module.exports = Mechanic;
