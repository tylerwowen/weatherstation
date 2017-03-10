/**
 * Created by tylero on 3/9/17.
 */
let express = require('express');
let router = express.Router();
let mongoDB = require('../mongo');

/* GET temperatures in a . */
router.get('/start/:start/end/:end', function(req, res, next) {

    res.send('respond with a resource');
    console.log(mongoDB.connection)
});

module.exports = router;
