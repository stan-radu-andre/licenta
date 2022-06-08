const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const mechanicSchema = new Schema(
  {
    userId: {
      type: String,
    },
    rating: {
      type: Number,
    },
    appointmentsDone: {
      type: Number,
    },
    preferedCars: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Car',
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Mechanic = mongoose.model('Mechanic', mechanicSchema);

module.exports = Mechanic;
