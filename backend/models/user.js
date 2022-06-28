const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Car = require('./car').schema;

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      min: 6,
      max: 20,
    },
    number: {
      type: String,
      required: true,
    },
    age: {
      type: Number,
    },
    isMechanic: {
      type: Boolean,
      required: true,
    },
    mechanic: {
      type: Schema.Types.ObjectId,
      ref: 'Mechanic',
    },
    car: Car,
    date: {
      type: Date,
      default: Date.now,
    },
    appointments: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Appointment',
      },
    ],
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model('User', userSchema);

module.exports = User;
