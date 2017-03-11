/**
 * Created by tylero on 3/9/17.
 */
let express = require('express');
let router = express.Router();
let mongoDB = require('../mongo');

/* GET temperatures in a . */
router.get('/start/:start/end/:end', function(req, res, next) {

    // res.send('respond with a resource');
    mongoDB.getTemepratureBetween(new Date('October 13, 2014 11:13:00'), new Date())
        .then((temperatures) => {
            console.log(temperatures);
            res.json({'temperature': temperatures});
        }, (err) => {
            res.status(504).send('Failed to fetch temperatures.')
        });

});

router.get('/:temp', function (req, res, next) {
    mongoDB.saveTemperature(req.param.temp);
    res.send('got');
});

module.exports = router;
