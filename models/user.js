var mongoose = require("mongoose")
var Schema = mongoose.Schema
var passportLoacalMongoose = require('passport-local-mongoose');

var User = new Schema({

    admin: {
        type: Boolean,
        default: false
    }
})
User.plugin(passportLoacalMongoose)
module.exports = mongoose.model("User", User);