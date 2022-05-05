var express = require('express');
const Appointment = require('../models/appointment');
const Car = require('../models/car');
var router = express.Router();

router.post('/create', async (req, res, next) => {
  const { maker, year, model, description, fuel, typeOfProblem } = req.body;
  console.log(maker, year, model, req.body);
  const car = new Car({ maker, year, model });
  // const appointment = new Appointment({
  //   car,
  // });
  try {
    // const savedUser = await user.save();
    // res.send({ user: savedUser._id });
    res.status(200).json({ message: 'Success' });
  } catch (err) {
    res.status(400).send(err);
  }
});

module.exports = router;
