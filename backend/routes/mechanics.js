var express = require('express');
const User = require('../models/user');
const Mechanic = require('../models/mechanic');
var router = express.Router();

router.get('/recommendations', async (req, res, next) => {
  // to do algoritm
  const { appointmentId } = req.body;
  try {
    User.find({ isMechanic: true })
      .populate('mechanic')
      .then((mechanics) => {
        res.json({ message: 'Success', mechanics });
      });
  } catch (error) {
    console.log(error);
    res.status(400).send({ error });
  }
});

module.exports = router;
