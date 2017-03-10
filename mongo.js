/**
 * Created by tylero on 3/9/17.
 */
let MongoClient = require('mongodb').MongoClient;
let assert = require('assert');

class MongoDB {

    constructor () {
        this._url = 'mongodb://ds127190.mlab.com:27190/weather';
    }

    connect () {
        // Use connect method to connect to the server
        MongoClient.connect(this._url, (err, db) => {
            assert.equal(null, err);
            console.log("Connected successfully to server");
            this._connection = db;
        });
    }

    get connection () {return this._connection;}
}

const mongoDB = new MongoDB();

module.exports = mongoDB;