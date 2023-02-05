const express = require('express')
const cors = require('cors')
const app = express()


const whitelist = ['http://localhost:3000', 'https://localhost:3443'];

var corsOptionDelegate = (req, callback) => {
    var corsoptions;
    if (whitelist.indexOf(req.header('Origin')) !== -1) {
        corsoptions = { origin: true }
    }
    else {
        corsoptions = { origin: false }
    }
    callback(null, corsoptions);
};
exports.cors = cors();
exports.corsWithOption = cors(corsOptionDelegate)