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

function roundToDay(date) {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function roundToHour(date) {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours());
}

class MongoDB {

    /**
     * @constructor
     */
    constructor () {
        this._url = 'mongodb://pi:pi123@ds127190.mlab.com:27190/weather';
    }

    get connection () {return this._connection;}

    /**
     * Connects to DB
     * @returns {Promise}
     */
    connect () {
        // Use connect method to connect to the server
        return MongoClient.connect(this._url).then((db) => {
            console.log('Connected successfully to server');
            this._connection = db;
            this._tempHum = db.collection('temphum');
        });
    }

    /**
     *
     * @param{number} temp
     * @param{number} hum
     * @param{string} unit
     * @param{Date} timestamp
     * @returns {Promise.<CommandResult>}
     */
    saveTempHum (temp, hum, unit = 'c', timestamp = new Date()) {
        let date = new Date(timestamp);
        let hour = date.getHours();
        let minute = date.getMinutes();
        let hourKey = `hours.${hour}`;
        let minuteKey = `minutes.${hour}.${minute}`;

        if (unit != 'c') {
            temp = FToC(temp);
        }

        return this.updateTempHum(date, temp, hum, hourKey, minuteKey)
            .then((results) => {
                if (results.modifiedCount === 0) {
                    return this.preAllocate(date)
                        .then( () => {
                            this.updateTempHum(date, temp, hum, hourKey, minuteKey);
                        });
                }
                return results;
            });
    }

    updateTempHum(date, temp, hum, hourKey, minuteKey) {
        return this._tempHum.updateOne(
            {
                date: roundToDay(date)
            },
            {
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
                    [`${hourKey}.totalTemp`]: temp,
                    [`${hourKey}.totalHum`]: hum,
                    [`${hourKey}.tempCount`]: 1,
                    [`${hourKey}.humCount`]: 1
                },
                $set: {
                    [minuteKey]: {
                        temp: temp,
                        hum: hum
                    }
                }
            },
            {upsert: false}
        );
    }

    /**
     *  Allocate a document in DB for the given date.
     * @param{Date} date
     * @returns {Promise}
     */
    preAllocate(date) {
        let hours = {};
        let minutes = {};

        for ( let i = 0; i < 24; i++) {
            hours[i] = {
                totalTemp: 0,
                totalHum: 0,
                tempCount: 0,
                humCount: 0
            };
            minutes[i] = {};
            for (let j = 0; j < 60; j++) {
                minutes[i][j] = {
                    temp: null,
                    hum: null
                };
            }
        }

        return this._tempHum.updateOne(
            {
                date: roundToDay(date),
            },
            {
                $set: {
                    highTemp: -100,
                    highHum: -100,
                    lowTemp: 100,
                    lowHum: 100,
                    totalTemp: 0,
                    totalHum: 0,
                    tempCount: 0,
                    humCount: 0,
                    unit: 'c',
                    hours: hours,
                    minutes: minutes
                }
            },
            {upsert: true}
        );
    }

    /**
     *
     * @param{Date} start
     * @param{Date} end
     * @param{string} granularity
     * @returns {*}
     */
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

    /**
     *
     * @param{Date} start
     * @param{Date} end
     * @returns {Promise.<Array.<Object>>}
     */
    getTempHumBetweenByMin(start, end) {
        return this._tempHum.find(
            {
                date: {
                    $gte: roundToDay(start),
                    $lte: roundToDay(end)
                }
            },
            {
                date: 1,
                minutes: 1
            }
        ).toArray()
            .then((dbResults) => {
                let finalResults = [];
                for (let day of dbResults) {
                    for (let hourKey in day.minutes) {
                        if (day.minutes.hasOwnProperty(hourKey)) {
                            let ts_hour = new Date(day.date);
                            ts_hour.setHours(parseInt(hourKey));
                            if (ts_hour < roundToHour(start) || ts_hour > roundToDay(end) + 1)
                                continue;
                            for (let minuteKey in day.minutes[hourKey]) {
                                if (day.minutes[hourKey].hasOwnProperty(minuteKey)) {
                                    let ts = new Date(ts_hour);
                                    ts.setMinutes(parseInt(minuteKey));
                                    let data = {
                                        temperature: day.minutes[hourKey][minuteKey].temp,
                                        humidity: day.minutes[hourKey][minuteKey].hum,
                                        timestamp: ts
                                    };
                                    if (ts >= start && ts <= end && data.temperature != null)
                                        finalResults.push(data);
                                }
                            }
                        }
                    }
                }
                return finalResults;
            });
    }

    getTempHumBetweenByHour(start, end) {
        return this._tempHum.find(
            {
                date: {
                    $gte: roundToDay(start),
                    $lte: roundToDay(end)
                }
            },
            {
                date: 1,
                hours: 1
            })
            .toArray()
            .then((dbResults) => {
                let finalResults = [];
                for (let day of dbResults) {
                    for (let hourKey in day.hours) {
                        if (day.hours.hasOwnProperty(hourKey)) {
                            let ts = new Date(day.date);
                            ts.setHours(parseInt(hourKey));
                            let data = {
                                avgTemp: day.hours[hourKey].totalTemp / day.hours[hourKey].tempCount,
                                avgHum: day.hours[hourKey].totalHum / day.hours[hourKey].humCount,
                                timestamp: ts
                            };
                            if (ts >= start && ts <= end && day.hours[hourKey].tempCount != 0)
                                finalResults.push(data);
                        }
                    }
                }
                return finalResults.sort((a, b) => {
                    return a.timestamp < b.timestamp ? -1 : 1;
                });
            });
    }

    getTempHumBetweenByDay(start, end) {
        return this._tempHum.find(
            {
                date: {
                    $gte: roundToDay(start),
                    $lte: roundToDay(end)
                }
            },
            {
                date: 1,
                totalTemp: 1,
                totalHum: 1,
                tempCount: 1,
                humCount: 1,
            })
            .toArray()
            .then((dbResults) => {
                let finalResults = [];
                for (let day of dbResults) {
                    let data = {
                        avgTemp: day.totalTemp / day.tempCount,
                        avgHum: day.totalHum / day.humCount,
                        timestamp: day.date
                    };
                    if (day.tempCount != 0)
                        finalResults.push(data);
                }
                return finalResults.sort((a, b) => {
                    return a.timestamp < b.timestamp ? -1 : 1;
                });
            });
    }
}

const mongoDB = new MongoDB();

module.exports = mongoDB;