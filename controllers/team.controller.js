'use strict'
var Team = require('../models/team.model');
var League = require('../models/league.model');
var User = require('../models/user.model');
var jwt = require('../services/jwt');

//SAVE TEAM 

//UPDATE TEAM

//DELETE TEAM
function deleteTeam(req, res){
    let userId = req.params.idU;
    let leagueId = req.params.idL;
    let teamId = req.params.idT;

    if(userId != req.user.sub){
        res.status(500).send({message: 'No puedes acceder a esta funcion'})
    }else{
        League.findById(leagueId, (err, leagueFind)=>{
            if(err){
               res.status(500).send({message: 'error general', err})
            }else if(leagueFind){
                User.findById(userId, (err, userFind)=>{
                    if (err) {
                        res.status(500).send({message: 'ERROR GENERAL', err})
                    }else if (userFind) {
                        if(leagueFind.admin == userId || userFind.role == 'ROLE_ADMIN'){
                            League.findOneAndUpdate({_id: leagueId, team: teamId},
                                {$pull: {team: teamId}}, {new:true}, (err, teamPull)=>{
                                    if(err){
                                        return res.status(500).send({message: 'Error general'})
                                    }else if(teamPull){
                                     Team.findByIdAndRemove(teamId, (err, teamRemoved)=>{
                                            if(err){
                                                return res.status(500).send({message: 'Error general', err})
                                            }else if(teamRemoved){
                                                return res.send({message: 'Equipo eliminado exitosamente', teamPull});
                                            }else{
                                                return res.status(404).send({message: 'Registro no encontrado o Equipo ya eliminado'})
                                            }
                                        })
                                    }else{
                                        return res.status(404).send({message: 'Eliminado de la base de datos, aun existente en Liga'})
                                    }
                                }).populate('team')
                        
                                }else{
                                    res.status(418).send({message: 'Usuario no permitido'});   
                                }
                            }else{
                                res.status(401).send({message: 'Usuario no econtrado'})
                            }
                        })
                    }else{
                        res.status(404).send({message: 'Liga no encontrada'});
                    }
                })
        }
    }
//LIST TEAM
function getTeams(req, res){
    Team.find({}).exec((err, team)=>{
        if(err){
            res.status(500).send({message: 'Error en el servidor'})
        }else if(team){
            res.status(200).send({message: 'Ligas encontradas', team})
        }else{
            res.status(200).send({message: 'No hay registros'})
        }
    }) 
}
//SEARCH TEAM 
function searchTeam(req, res){
    var params = req.body;
    var userId = req.params.id;
    if(userId != req.user.sub){
        res.status(500).send({message: 'No posees permisos para realizar acciones de administrador'})
    }else{
    if(params.search){
        Team.find({$or:[{name: params.search}]}, (err, resultsSearch)=>{
            if(err){
                return res.status(500).send({message: 'ERROR GENERAL', err})
            }else if(resultsSearch){
                return res.send({resultsSearch})
            }else{
                return res.status(404).send({message:'No hay registros para mostrar'})
            }
        })
    }else{
        return res.status(403).send({message:'Ingresa algún dato en el campo de búsqueda'})
    }
    }
}
//FUNCTIONS ROUTES
module.exports = {
    deleteTeam,
    getTeams,
    searchTeam
}