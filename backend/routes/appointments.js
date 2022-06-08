var express = require('express');
const Appointment = require('../models/appointment');
const Car = require('../models/car');
const User = require('../models/user');
const Mechanic = require('../models/mechanic');
var router = express.Router();

router.post('/create', async (req, res, next) => {
  const {
    maker,
    year,
    model,
    description,
    fuel,
    typeOfProblem,
    userId,
    date,
    mechanicId,
  } = req.body;
  const car = new Car({ maker, year, model });
  const user = await User.findOne({ _id: userId });
  const mechanic = await User.findOne({ _id: mechanicId });
  const appointment = new Appointment({
    car,
    description,
    date,
    user,
    mechanic,
  });
  try {
    const savedAppointment = await appointment.save();
    user.appointments = [...user.appointments, savedAppointment];
    mechanic.appointments = [...mechanic.appointments, savedAppointment];
    await user.save();
    await mechanic.save();
    res
      .status(200)
      .json({ message: 'Success', appointmentId: savedAppointment });
  } catch (error) {
    console.log(error);
    res.status(400).send({ error });
  }
});

module.exports = router;
