'use strict'

var express = require('express');
var api = express.Router();
var mdAuth = require('../middlewares/authenticated');
var connectMultiparty = require('connect-multiparty');

//controller route 
var userController = require('../controllers/user.controller');


//USERS
api.delete('/deleteUser/:idU', mdAuth.ensureAuth, userController.deleteUser);
api.put('/:id/uploadImage', [mdAuth.ensureAuth, mdUpload], userController.uploadImage);
api.get('/getImage/:fileName', [ mdUpload], userController.getImage);
api.put('/updateUser/:id', mdAuth.ensureAuth, userController.updateUser);
api.post('/searchUser/:id' ,[mdAuth.ensureAuth, mdAuth.ensureAuthAdmin], userController.searchUser);
api.get('/getUsers', userController.getUsers);

module.exports = api;