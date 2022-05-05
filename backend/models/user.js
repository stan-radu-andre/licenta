const mongoose = require('mongoose');
const Schema = mongoose.Schema;

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
    isMechanic: {
      type: Boolean,
      required: true,
    },
    mechanic: {
      type: Schema.Types.ObjectId,
      ref: 'Mechanic',
    },
    car: {
      type: Schema.Types.ObjectId,
      ref: 'Car',
    },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model('User', userSchema);

module.exports = User;
