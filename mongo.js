/**
 * Created by tylero on 3/9/17.
 */
let MongoClient = require('mongodb').MongoClient;
let assert = require('assert');

class MongoDB {

    constructor () {
        this._url = 'mongodb://pi:pi123@ds127190.mlab.com:27190/weather';
    }

    get connection () {return this._connection;}

    connect () {
        // Use connect method to connect to the server
        MongoClient.connect(this._url, (err, db) => {
            assert.equal(null, err);
            console.log("Connected successfully to server");
            this._connection = db;
            this._temperature = db.collection('temperature');
            // this._humidity = db.collection('humidity');
        });
    }

    saveTemperature (temp, unit = 'c') {
        this._temperature.insertOne({
            "temperature": temp,
            "unit": unit,
            "timestamp": new Date()
        });
    }

    getTemepratureBetween (start = new Date('October 13, 2014 11:13:00'), end = new Date()) {
        return this._temperature.find({
            "timestamp": {
                $gte: start,
                $lt: end
            }
        }).toArray();
    }
}

const mongoDB = new MongoDB();

module.exports = mongoDB;