'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var matchesSchema = Schema({
    team1: {type: Schema.ObjectId, ref: 'team'},
    team2: {type: Schema.ObjectId, ref: 'team'},
    result1: Number,
    result2: Number,
    league: {type: Schema.ObjectId, ref: 'league'}
    
})
module.exports = mongoose.model('match', matchesSchema);