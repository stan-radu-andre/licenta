const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Car = require('./car').schema;

const appointmentSchema = new Schema(
  {
    description: {
      type: String,
    },
    date: {
      type: Date,
      required: false,
    },
    time: {
      type: Date,
    },
    timeEstimation: {
      type: String,
    },
    car: Car,
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    rating: {
      type: Number,
    },
    ratingFeedback: {
      type: String,
    },
    mechanic: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    status: {
      type: String,
      default: 'new',
    },
    preferedDates: [Date],
    minTime: [Date],
    maxTime: [Date],
    asap: Boolean,
    anytime: Boolean,
  },
  {
    timestamps: true,
  }
);

const Appointment = mongoose.model('Appointment', appointmentSchema);

module.exports = Appointment;
