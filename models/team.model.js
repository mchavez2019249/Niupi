'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var teamSchema = Schema({
    name: String,
    icon: String,
    points: Number,
    gf: Number,
    gc: Number,
    diference: Number,
    matches: Number,
    admin: {type: Schema.ObjectId, ref: 'user'}
    
})
module.exports = mongoose.model('team', teamSchema);