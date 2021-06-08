'use strict'

var jwt = require('jwt-simple');
var moment = require('moment');
var secretKey = 'TORNEOKINALIN6BV';

exports.createToken = (user)=>{
    var payload = {
        sub: user._id,
        name: user.name,
        lastname: user.lastname,
        email: user.email,
        role: user.role,
        iat: moment().unix(),
        exp: moment().add(1, 'hour').unix()
    }
    return jwt.encode(payload, secretKey);
}