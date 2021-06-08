'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var userSchema = Schema({
    name: String,
    lastname: String,
    username: String,
    password: String,
    phone: String,
    role: String,
    image: String
})
module.exports = mongoose.model('user', userSchema);