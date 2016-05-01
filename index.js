// Import the interface to Tessel hardware
const tessel = require('tessel');
const ambientlib = require('ambient-attx4');
const express = require('express');

const ambient = ambientlib.use(tessel.port['A']);

const app = express();

var status = 'ok'
var lastSound
var maxSound = 0

ambient.on('ready', function () {

  setInterval( function () {

    ambient.getSoundLevel( (err, sounddata) => {

      if (err) throw err;

      console.log(`Sound: ${lastSound}`)
      lastSound = sounddata.toFixed(8)

      if (lastSound > maxSound) {
        maxSound = lastSound
      }

    });

  }, 500); // The readings will happen every .5 seconds

});

ambient.on('error', function (err) {
  console.log(err);
});


app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html')
})

app.get('/status', function (req, res) {
  res.json({
    status: maxSound >= 0.07 ? 'alert' : 'ok',
    maxSound
  })
})

app.listen(80, function () {
  console.log('Example app listening on port 80!');
})
