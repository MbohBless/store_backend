var mongoose = require("mongoose")
var Schema = mongoose.Schema
var passportLoacalMongoose = require('passport-local-mongoose');

var User = new Schema({ 
    firstname: {
        type: String,
        default: ''
    },
    lastname: {
        type: String,
        default: ''
    },
    facebookId: String,
    admin: {
        type: Boolean,
        default: false
    }
})
User.plugin(passportLoacalMongoose)
module.exports = mongoose.model("User", User);