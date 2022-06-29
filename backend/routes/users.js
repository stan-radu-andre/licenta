var express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
var router = express.Router();
const User = require('../models/user');
const Mechanic = require('../models/mechanic');
const {
  validateRegister,
  validateLogin,
  validateProfile,
} = require('../validation');
const Car = require('../models/car');

/* GET users listing. */
router.get('/login', function (req, res, next) {
  res.send('respond with a resource');
});

const buildMechanicCars = (cars) => {
  return cars.map((car) => {
    return new Car({
      model: car.model,
      year: car.year,
      maker: car.maker,
    });
  });
};

const getToken = (user, email) => {
  return jwt.sign(
    {
      email,
      id: user._id,
      isMechanic: user.isMechanic,
    },
    process.env.ACCESS_TOKEN_SECRET
  );
};

router.post('/register', validateRegister, async (req, res) => {
  const { name, email, password, isMechanic, number, age, cars } = req.body;

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = new User({
    name,
    email,
    password: hashedPassword,
    isMechanic,
    number,
    age,
  });
  const emailExists = await User.findOne({ email });
  if (emailExists) {
    return res.status(400).json({ error: 'Email already exists' });
  }
  if (!isMechanic) {
    try {
      const savedUser = await user.save();
      const token = getToken(user, email);
      res.json({ user: savedUser, accessToken: token });
    } catch (err) {
      res.status(400).send(err);
    }
  } else {
    try {
      // Mechanic.remove({ _id: user.mechanic });
      const mechanic = new Mechanic({
        userId: user._id,
        preferedCars: cars,
      });
      const savedMechanic = await mechanic.save();
      user.isMechanic = true;
      user.mechanic = savedMechanic;
      const savedUser = await user.save();
      const token = getToken(user, email);
      res.json({ user: savedUser, accessToken: token });
    } catch (err) {
      console.log(err);
      res.status(400).send(err);
    }
  }
});

const getMechanic = async (mechanicId) => {
  try {
    return await Mechanic.findOne({ _id: mechanicId }).populate('preferedCars');
  } catch (err) {
    console.log('err', err);
  }
};

router.put('/profile', validateProfile, async (req, res) => {
  const { name, email, isMechanic, number, age, cars } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({ error: 'Error finding the user' });
  }
  user.name = name;
  user.email = email;
  user.number = number;
  user.age = age;
  if (!isMechanic) {
    try {
      const savedUser = await user.save();
      res.send({ user: savedUser });
    } catch (err) {
      res.status(400).send(err);
    }
  } else {
    try {
      const mechanic = await getMechanic(user.mechanic._id);
      mechanic.preferedCars = buildMechanicCars(cars);
      console.log('savedMechanic', mechanic);
      const savedMechanic = await mechanic.save();
      user.isMechanic = true;
      user.mechanic = savedMechanic;
      const savedUser = await user.save();
      res.send({ user: savedUser });
    } catch (err) {
      console.log(err);
      res.status(400).send(err);
    }
  }
});

router.post('/login', validateLogin, async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).populate({
    path: 'mechanic',
  });
  // .populate('mechanic mechanic.preferedCars')
  // .populate({ path: 'mechanic.preferedCars' });
  if (!user) {
    return res.status(400).json({ error: 'Email or password are wrong' });
  }
  const validPass = await bcrypt.compare(password, user.password);
  if (validPass) {
    const accessToken = jwt.sign(
      {
        email,
        id: user._id,
        isMechanic: user.isMechanic,
      },
      process.env.ACCESS_TOKEN_SECRET
    );
    res.json({ accessToken: accessToken, user });
    // if (!user.isMechanic) {
    //   res.json({ accessToken: accessToken, user });
    // } else {
    //   const mechanicObject = await populateMechanic(user.mechanic.toString());
    //   user.mechanic = mechanicObject;
    //   res.json({
    //     accessToken: accessToken,
    //     user,
    //     userMehcnic: { ...user, mechanic: mechanicObject },
    //   });
    // }
  } else {
    return res.status(400).json({ error: 'Email or password are wrong' });
  }
});

router.get('/appointments_user/:id', async (req, res, next) => {
  const userId = req.params.id;
  try {
    User.findOne({
      _id: userId,
    })
      .populate({
        path: 'appointments',
        populate: {
          path: 'mechanic',
        },
      })
      .then((user) => {
        const { appointments = [] } = user;
        res.send({ message: 'Success', appointments });
      });
  } catch (error) {
    console.log('error', error);
    res.status(400).send({ error });
  }
});

module.exports = router;
