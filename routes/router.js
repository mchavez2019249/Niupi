'use strict'

var express = require('express');
var api = express.Router();
var mdAuth = require('../middlewares/authenticated');
var connectMultiparty = require('connect-multiparty');

//controller route 
var userController = require('../controllers/user.controller');

//USERS
api.delete('/deleteUser/:idU', mdAuth.ensureAuth, userController.deleteUser);

module.exports = api;