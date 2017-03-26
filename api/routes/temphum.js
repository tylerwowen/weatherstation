/**
 * Created by tylero on 3/9/17.
 */
let express = require('express');
let router = express.Router();
let dataBase = require('../DB/mongo');

/* GET temperatures in a rage of dates. */
router.get('/start/:start/end/:end/granularity/:granularity', function(req, res, next) {

  let start = new Date(parseInt(req.params.start));
  let end = new Date(parseInt(req.params.end));
  let granularity = req.params.granularity;

  if (granularity !== 'min' && granularity !== 'hour' && granularity !== 'day') {
    res.status(400).end();
    return;
  }

  if (start >= end) {
    res.status(400).send("Start cannot be later than end!");
    return;
  }

  // TODO: add policy class to support configuration
  if (granularity === 'min' && end.getTime() - start.getTime() > 6*3600*1000) {
    res.status(400).send("You can't get minutes data longer than 6 hours!");
    return;
  }

  dataBase.getTempHumBetween(start, end, granularity)
    .then((temperatures) => {
      res.json({'results': temperatures});
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Failed to fetch temperatures.')
    });
});

router.post('/add', function (req, res, next) {

  let body = req.body;
  if (body.temperature === undefined
    || body.humidity === undefined) {

    res.status(400).send('The request body is not acceptable!');
  }
  else {
    dataBase.saveTempHum(body.temperature, body.humidity, body.unit, body.timestamp)
      .then(() => {
        res.status(200).end();
      })
      .catch((err) => {
        console.error(err);
        res.status(400).send();
      });
  }
});

module.exports = router;
