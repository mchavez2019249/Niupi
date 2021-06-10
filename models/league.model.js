'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var leagueSchema = Schema({
    name: String
})
module.exports = mongoose.model('league', leagueSchema);