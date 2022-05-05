require('dotenv').config();
const jwt = require('jsonwebtoken');
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var appointmentsRouter = require('./routes/appointments');
var getWebsite = require('./routes/getWebsite');
const Blog = require('./models/user');

var app = express();

var dbURL =
  'mongodb+srv://radu2:raducu@cluster0.8uey4.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';
mongoose
  .connect(dbURL)
  .then((result) => {
    console.log('connected to db');
    app.listen(3000);
  })
  .catch((e) => console.log('error', e));
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(bodyParser.json());
app.use(methodOverride());
app.options('*', cors());

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/getWebsite', getWebsite);
app.use('/appointments', authenticateToken, appointmentsRouter);

app.get('/add-blog', authenticateToken, (req, res) => {
  const blog = new Blog({
    title: 'New blog',
    snippet: 'about new blog',
    body: 'more about blog',
  });

  blog
    .save()
    .then((result) => {
      res.send(result);
    })
    .catch((err) => console.log(err));
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (token == null) return res.sendStatus(401);
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

module.exports = app;
