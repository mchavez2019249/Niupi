'use strict'
var Team = require('../models/team.model');
var jwt = require('../services/jwt');

//SAVE TEAM 

//UPDATE TEAM

//DELETE TEAM
function deleteTeam(req, res){
    var idTeam = req.params.idT;
    var adminId = req.params.idU;
    if(adminId !=req.user.sub){
        res.status(403).send({message: 'No puede acceder a esta funcion'})
    }else{
        Team.findById(idTeam, (err, teamFind)=>{
            if(err){
                res.status(500).send({message: 'ERROR GENERAL'});
            }else if(teamFind){
                if(teamFind.admin == adminId){
                    Team.findByIdAndRemove(idTeam, (err, teamDelete)=>{
                        if(err){
                            res.status(500).send({message: 'ERROR GENERAL'});
                        }else if(teamDelete){
                            res.send({message: 'Equipo eliminado exitosamente'});
                        }else{
                            res.send({message: 'Error al eliminar Equipo'});
                        }
                    });
                }else{
                    res.status(403).send({message: 'Usuario no autorizado'});
                }             
            }else{
                res.status(403).send({message: 'Usuario no autorizado'});
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