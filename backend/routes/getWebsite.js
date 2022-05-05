var express = require('express');
const http = require('http');
var router = express.Router();

/* GET users listing. */
router.get('/', function (req, response, next) {
  var options = {
    host: 'www.obd-codes.com',
    port: 80,
    path: '/p2007',
  };

  http
    .get(options, function (res) {
      console.log('Got response: ' + JSON.stringify(res));
      response.send(res);
    })
    .on('error', function (e) {
      console.log('Got error: ' + e.message);
    });
});

module.exports = router;
