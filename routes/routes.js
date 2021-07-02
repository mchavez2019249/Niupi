'use strict'

var express = require('express');
var api = express.Router();
var mdAuth = require('../middlewares/authenticated');
var connectMultiparty = require('connect-multiparty');
var mdUpload = connectMultiparty({ uploadDir: './uploads/users'});

//controllers routes
var userController = require('../controllers/user.controller');
var leagueController = require('../controllers/league.controller');
var teamController = require('../controllers/team.controller');
var matchController = require('../controllers/match.controller');

//USERS
api.post('/saveUser', userController.saveUser);
api.put('/deleteUser/:idU', mdAuth.ensureAuth, userController.deleteUser);
//api.put('/:id/uploadImage', [mdAuth.ensureAuth, mdUpload], userController.uploadImage);
//api.get('/getImage/:fileName', [ mdUpload], userController.getImage);
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
//api.put('/:id/uploadImageT/idT', [mdAuth.ensureAuth, mdUpload], userController.uploadImageT);
//api.get('/getImageT/:fileName', [ mdUpload], userController.getImageT);
api.delete('/deleteTeam/:idU/:idT/:idL' ,[mdAuth.ensureAuth],teamController.deleteTeam);
api.put('/updateTeam/:idU/:idT' ,[mdAuth.ensureAuth],teamController.updateTeam);
api.get('/getTeams', teamController.getTeams);
api.post('/searchTeam/:id' ,[mdAuth.ensureAuth, mdAuth.ensureAuthAdmin], teamController.searchTeam);
api.post('/saveTeam/:id', mdAuth.ensureAuth, teamController.saveTeam);
api.put('/setTeam/:idL/:idT/:idU', mdAuth.ensureAuth, teamController.setTeam);
//MATCHES
api.post('/saveMatch/:idUser/:idLeague/:idteam1/:idteam2', mdAuth.ensureAuth, matchController.saveMatch);

module.exports = api;





























