var express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
var router = express.Router();
const User = require('../models/user');
const { validateRegister, validateLogin } = require('../validation');

/* GET users listing. */
router.get('/login', function (req, res, next) {
  res.send('respond with a resource');
});

router.post('/register', validateRegister, async (req, res) => {
  const { name, email, password, isMechanic, number } = req.body;

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = new User({
    name,
    email,
    password: hashedPassword,
    isMechanic,
    number,
  });
  const emailExists = await User.findOne({ email });
  if (emailExists) {
    return res.status(400).json({ error: 'Email already exists' });
  }
  if (!isMechanic) {
    try {
      const savedUser = await user.save();
      res.send({ user: savedUser._id });
    } catch (err) {
      res.status(400).send(err);
    }
  } else {
    try {
      const savedUser = await user.save();
      res.send({ user: savedUser._id });
    } catch (err) {
      res.status(400).send(err);
    }
  }
});

router.post('/login', validateLogin, async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
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
    console.log('accessToken', accessToken);
    res.json({ accessToken: accessToken, user });
  } else {
    return res.status(400).json({ error: 'Email or password are wrong' });
  }
});

module.exports = router;
