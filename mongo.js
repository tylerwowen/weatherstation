/**
 * Created by tylero on 3/9/17.
 */
let MongoClient = require('mongodb').MongoClient;
let assert = require('assert');

/**
 * @return {number}
 */
function FToC(temp) {
    return (temp - 32 ) * 5 / 9;
}

function getMidnight(date) {
    return new Date(date.getFullYear(), date.getMonth(), date.getDay());
}

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
            this._tempHum = db.collection('temperature');
        });
    }

    saveTempHum (temp, hum, unit = 'c', timestamp = new Date().toISOString()) {
        let date = new Date(timestamp);
        let hour = date.getHours();
        let minute = date.getMinutes();
        let hourKey = 'values_hour.' + hour.toString();
        let minuteKey =  hourKey + '.' + minute.toString();

        if (unit != 'c') {
            temp = FToC(temp);
            unit = 'c'
        }

        return this._tempHum.updateOne(
            {
                timestamp_day: getMidnight(date)
            },
            {
                $setOnInsert: {
                    unit: unit,
                    "hours": [{
                        timestamp_hour: hour,
                        "minutes": [{
                            timestamp_minute: minute
                        }]
                    }],

                },
                $max: {
                    highTemp: temp,
                    highHum: hum
                },
                $min: {
                    lowTemp: temp,
                    lowHum: hum
                },
                $inc: {
                    totalTemp: temp,
                    totalHum: hum,
                    tempCount: 1,
                    humCount: 1//,
                    // [hourKey+'.totalTemp']: temp,
                    // [hourKey+'.totalHum']: hum,
                    // [hourKey+'.tempCount']: 1,
                    // [hourKey+'.humCount']: 1
                }//,
                $push:{
                    "hours.$.minutes":{
                        temperature: temp,
                        humidity: hum
                    }
                }
            },
            {
                upsert: true
            });
    }

    getTempHumBetween (
        start = new Date('January 1, 2017 00:00:00'),
        end = new Date(),
        granularity) {

        return this._tempHum.aggregate([
            {
                $match: {
                    timestamp_day: {
                        $gte: getMidnight(start),
                        $lte: getMidnight(end)
                    }
                }
            },
            {$unwind: "$values"}
        ]).toArray();
    }
}

const mongoDB = new MongoDB();

module.exports = mongoDB;