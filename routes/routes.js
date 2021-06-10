'use strict'

var express = require('express');
var api = express.Router();
var mdAuth = require('../middlewares/authenticated');
var connectMultiparty = require('connect-multiparty');

//controllers routes
var userController = require('../controllers/user.controller');
var leagueController = require('../controllers/league.controller');
var teamController = require('../controllers/team.controller');

//USERS
api.post('/saveUser/:id' ,[mdAuth.ensureAuth, mdAuth.ensureAuthAdmin], userController.saveUser);
api.delete('/deleteUser/:idU', mdAuth.ensureAuth, userController.deleteUser);
api.put('/:id/uploadImage', [mdAuth.ensureAuth, mdUpload], userController.uploadImage);
api.get('/getImage/:fileName', [ mdUpload], userController.getImage);
api.put('/updateUser/:id', mdAuth.ensureAuth, userController.updateUser);
api.post('/searchUser/:id' ,[mdAuth.ensureAuth, mdAuth.ensureAuthAdmin], userController.searchUser);
api.get('/getUsers', userController.getUsers);
api.post('/login', userController.login);
//LEAGUE
api.post('/saveLeague/:id' ,mdAuth.ensureAuth,leagueController.saveLeague);
api.delete('/deleteLeague/:idU/:idL' ,mdAuth.ensureAuth,leagueController.deleteLeague);
api.get('/getLeagues', leagueController.getLeagues);
api.put('/updateLeague/:idU/:idL' ,mdAuth.ensureAuth,leagueController.updateLeague);
api.post('/searchUser/:id' ,[mdAuth.ensureAuth, mdAuth.ensureAuthAdmin], leagueController.searchLeague);
//TEAM
api.delete('/deleteTeam/:idU/:idT' ,[mdAuth.ensureAuth],teamController.deleteTeam);
api.get('/getLeagues', teamController.getTeams);
api.post('/searchUser/:id' ,[mdAuth.ensureAuth, mdAuth.ensureAuthAdmin], teamController.searchTeam);

module.exports = api;