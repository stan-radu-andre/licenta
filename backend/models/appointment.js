const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const appointmentSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    car: {
      type: Schema.Types.ObjectId,
      ref: 'Car',
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    mechanic: {
      type: Schema.Types.ObjectId,
      ref: 'Mechanic',
    },
    status: {
      type: String,
      default: 'new',
    },
  },
  {
    timestamps: true,
  }
);

const Appointment = mongoose.model('Appointment', appointmentSchema);

module.exports = Appointment;
