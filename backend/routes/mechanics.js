var express = require('express');
const User = require('../models/user');
const Mechanic = require('../models/mechanic');
const Appointment = require('../models/appointment');
var router = express.Router();

const getScore = (car, level, order) => {
  if (car.maker === order.maker && car.model === order.model) {
    return 20 - level;
  }
  if (car.maker === order.maker && car.model === 'Any model') {
    const score = 9 - level;
    return score > 5 ? score : 5;
  }
  if (
    car.maker === order.maker &&
    car.model !== 'Any model' &&
    car.model !== order.model
  ) {
    const score = 5 - level;
    return score > 2 ? score : 2;
  }
  if (car.maker === 'Any maker') {
    return 1;
  }
  return 0;
};

const getMaxScore = (preferedCars) => {
  return Math.max(...preferedCars.map((cars) => cars.score));
};

const scoreMechanics = (mechanicsUsers, order) => {
  return mechanicsUsers.map((mechanicUser) => {
    const { mechanic } = mechanicUser;
    const scoredCars = mechanic.preferedCars.map((car, level) => {
      const score = getScore(car, level, order);
      return { car, score };
    });
    const score = getMaxScore(scoredCars);
    const rating = mechanic.rating;
    return { score, rating, mechanicUser };
  });
};
const algoritm = (mechanicsUsers, order) => {
  const scoredMechanics = scoreMechanics(mechanicsUsers, order);
  scoredMechanics.sort((mechanic1, mechanic2) => {
    if (mechanic1.score > mechanic2.score) return -1;
    if (mechanic1.score < mechanic2.score) return 1;
    //treat undefined
    if (mechanic1.rating !== undefined && mechanic2.rating === undefined)
      return -1;
    if (mechanic1.rating === undefined && mechanic2.rating !== undefined)
      return 1;
    if (mechanic1.rating > mechanic2.rating) return -1;
    if (mechanic1.rating < mechanic2.rating) return 1;
    return 0;
  });
  return scoredMechanics;
};

router.get('/recommendations/:maker/:model', async (req, res, next) => {
  const maker = req.params.maker;
  const model = req.params.model;
  const order = { maker, model };
  try {
    User.where('isMechanic')
      .equals(true)
      .populate('mechanic')
      .then((mechanicsUsers) => {
        const sortedMechanics = algoritm(mechanicsUsers, order);
        res.json({
          message: 'Success',
          alg: sortedMechanics,
          mechanics: sortedMechanics.map((mechanic) => mechanic.mechanicUser),
        });
      });
  } catch (error) {
    console.log(error);
    res.status(400).send({ error });
  }
});

router.post('/rating', async (req, res, next) => {
  const { appointmentId, mechanicId, rating, ratingFeedback } = req.body;
  try {
    Appointment.findOne({ _id: appointmentId }).then(async (appointment) => {
      appointment.rating = rating;
      appointment.ratingFeedback = ratingFeedback;
      await appointment.save();
    });
    Mechanic.findOne({ _id: mechanicId }).then(async (mechanic) => {
      mechanic.rating = (mechanic.rating + rating) / mechanic.appointmentsDone;
      mechanic.appointmentsDone = mechanic.appointmentsDone + 1;
      await mechanic.save();
      res.json({ message: 'Success' });
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({ error });
  }
});

module.exports = router;
