var express = require('express');
const Appointment = require('../models/appointment');
const User = require('../models/user');
const Mechanic = require('../models/mechanic');
var router = express.Router();

router.post('/create', async (req, res, next) => {
  const {
    maker,
    year,
    model,
    description,
    userId,
    date,
    mechanicId,
    status,
    preferedDates,
    asap,
    anytime,
  } = req.body;
  const car = { maker, year, model };
  const user = await User.findOne({ _id: userId });
  let appointment = {};
  let savedAppointment = {};
  try {
    appointment = new Appointment({
      car,
      description,
      date,
      user,
      status,
      preferedDates,
      asap,
      anytime,
      mechanic: mechanicId ? mechanicId : null,
    });
    savedAppointment = await appointment.save();
    res.status(200).json({ message: 'Success', appointment: savedAppointment });
  } catch (error) {
    console.log(error);
    res.status(400).send({ error });
  }
});

router.get('/all/:status', async (req, res, next) => {
  const status = req.params.status || 'unassigned';
  try {
    Appointment.find({
      status: status,
    })
      .populate({
        path: 'user',
      })
      .then((appointments) => {
        res.send({ message: 'Success', appointments });
      });
  } catch (error) {
    console.log('error', error);
    res.status(400).send({ error });
  }
});

router.get('/client/:clientId/:status', async (req, res, next) => {
  const clientId = req.params.clientId;
  const status = req.params.status || 'new';
  try {
    Appointment.find({
      user: clientId,
      status: status,
    })
      .populate({
        path: 'mechanic',
        populate: {
          path: 'mechanic',
        },
      })
      .then((appointments) => {
        res.send({ message: 'Success', appointments });
      });
  } catch (error) {
    console.log('error', error);
    res.status(400).send({ error });
  }
});

router.get('/mechanic/:mechanicId/:status', async (req, res, next) => {
  const mechanicId = req.params.mechanicId;
  const status = req.params.status || 'new';
  try {
    Appointment.find({
      mechanic: mechanicId,
      status: status,
    })
      .populate({
        path: 'user',
      })
      .then((appointments) => {
        res.send({ message: 'Success', appointments });
      });
  } catch (error) {
    console.log('error', error);
    res.status(400).send({ error });
  }
});

router.put('/book', async (req, res, next) => {
  const { appointmentId, newDate, status, mechanicUserId } = req.body;
  try {
    Appointment.findOne({ _id: appointmentId }).then(async (appointment) => {
      appointment.status = status;
      if (newDate) appointment.date = newDate;
      if (mechanicUserId) {
        const thisMechanic = await User.findOne({ _id: mechanicUserId });
        appointment.mechanic = thisMechanic;
      }
      appointment.save().then((appointment) => {
        res.send({ message: 'Success', appointment });
      });
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({ error });
  }
});

const getAvgRating = async (mechanicUserId) => {
  const appointments = await Appointment.find({ mechanic: mechanicUserId });
  if (!appointments.length) return 0;
  const appointmentsWithRating = appointments.filter(
    (appointment) => appointment.rating !== undefined
  );
  const sumRating = appointmentsWithRating.reduce(
    (total, appointment) => appointment.rating + total,
    0
  );
  return (sumRating / appointmentsWithRating.length).toFixed(1);
};

const recalculateRating = async (mechanic) => {
  const mechanicDB = await Mechanic.findOne({ id: mechanic.mechanic });
  mechanicDB.rating = await getAvgRating(mechanic._id);
  await mechanicDB.save();
};

router.put('/updateItemWithId/:id', async (req, res, next) => {
  const { timeEstimation, rating, ratingFeedback } = req.body;
  const appointmentId = req.params.id;

  try {
    Appointment.findOne({ _id: appointmentId })
      .populate({
        path: 'mechanic',
      })
      .then(async (appointment) => {
        if (timeEstimation) appointment.timeEstimation = timeEstimation;
        if (rating) {
          appointment.rating = rating;
          await recalculateRating(appointment.mechanic);
        }
        if (ratingFeedback) appointment.ratingFeedback = ratingFeedback;
        appointment.save().then((appointment) => {
          res.send({ message: 'Success', appointment });
        });
      });
  } catch (error) {
    console.log(error);
    res.status(400).send({ error });
  }
});

module.exports = router;
