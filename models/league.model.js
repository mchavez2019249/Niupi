'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var leagueSchema = Schema({
    name: String,
    admin: {type: Schema.ObjectId, ref: 'user'},
    teams: [{type: Schema.ObjectId, ref: 'team'}]
})
module.exports = mongoose.model('league', leagueSchema);
