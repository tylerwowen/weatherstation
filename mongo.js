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
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
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
        let hourKey = 'hours.' + hour.toString();

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
                    humCount: 1,
                    [hourKey+'.totalTemp']: temp,
                    [hourKey+'.totalHum']: hum,
                    [hourKey+'.tempCount']: 1,
                    [hourKey+'.humCount']: 1
                },
                $push:{
                    [hourKey+'.minutes']:{
                        time_mintue: minute,
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

        switch (granularity) {
            case 'min':
                return this.getTempHumBetweenByMin(start, end);
                break;
            case 'hour':
                return this.getTempHumBetweenByHour(start, end);
                break;
            case 'day':
                return this.getTempHumBetweenByDay(start, end);
                break;
        }
    }

    getTempHumBetweenByMin(start, end) {
        return this._tempHum.aggregate([
            {
                $match: {
                    timestamp_day: {
                        $gte: getMidnight(start),
                        $lte: getMidnight(end)
                    }
                }
            },
            {$project: {timestamp_day: 1, hours: 1, _id: 0}}
        ]).toArray()
            .then((dbResults) => {
                let finalResults = [];
                dbResults.forEach((day) => {
                    for (let hour in day.hours) {
                        if (day.hours.hasOwnProperty(hour)) {
                            let minutes = day.hours[hour].minutes;
                            minutes.forEach((minute) => {
                                let ts = new Date(day.timestamp_day);
                                ts.setHours(parseInt(hour));
                                ts.setMinutes(parseInt(minute.time_mintue));
                                let data = {
                                    temperature: minute.temperature,
                                    humidity: minute.humidity,
                                    timestamp: ts
                                };
                                if (data.timestamp >= start && data.timestamp <= end)
                                    finalResults.push(data);
                            });
                        }
                    }
                });
                return finalResults;
            });
    }

    getTempHumBetweenByHour(start, end) {
        return promise.then((dbResults) => {

        });
    }

    getTempHumBetweenByDay(start, end) {
        return promise.then((dbResults) => {

        });
    }
}

const mongoDB = new MongoDB();

module.exports = mongoDB;