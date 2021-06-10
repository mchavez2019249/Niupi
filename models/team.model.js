'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var teamSchema = Schema({
    name: String
})
module.exports = mongoose.model('team', teamSchema);