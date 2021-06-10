'use strict'
var Team = require('../models/team.model');
var League = require('../models/league.model');
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
               if(leagueFind.admin == userId){
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
                res.status(404).send({message: 'Liga no encontrada'});
            }
        })
    }
}
//LIST TEAM

//SEARCH TEAM 

//FUNCTIONS ROUTES
module.exports = {
    deleteTeam
}