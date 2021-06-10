'use strict'
var League = require('../models/league.model');
var jwt = require('../services/jwt');

//SAVE LEAGUE

//UPDATE LEAGUE
function updateLeague(req, res){
    let userId = req.params.idU;
    let LeagueId = req.params.idL;
    let update = req.body;

    if(userId != req.user.sub){
        return res.status(404).send({message: 'No tienes permiso para realizar esta acción'});
    }else{
        if(update.name && update.phone){
            User.findOne({_id: userId, Leagues: LeagueId}, (err, userContact)=>{
                if(err){
                    return res.status(500).send({message: 'Error general'});
                }else if(userContact){
                    League.findByIdAndUpdate(LeagueId, update, {new: true}, (err, updateContact)=>{
                        if(err){
                            return res.status(500).send({message: 'Error general al actualizar'});
                        }else if(updateContact){
                            return res.send({message: 'Liga  actualizada', updateContact});
                        }else{
                            return res.status(401).send({message: 'No se pudo actualizar el contacto'});
                        }
                    })
                }else{
                    return res.status(404).send({message: 'Usuario o contacto inexistente'});
                }
            }) 
        }else{
            return res.status(404).send({message: 'Por favor ingresa los datos mínimos'});
        }       
    }
}
//DELETE LEAGUE
function deleteLeague(req, res){
    var idLeague = req.params.idL;
    var adminId = req.params.idU;
    if(adminId !=req.user.sub){
        res.status(403).send({message: 'No puede acceder a esta funcion'})
    }else{
        League.findById(idLeague, (err, leagueFind)=>{
            if(err){
                res.status(500).send({message: 'ERROR GENERAL'});
            }else if(leagueFind){
                if(leagueFind.admin == adminId){
                    League.findByIdAndRemove(idLeague, (err, leagueDelete)=>{
                        if(err){
                            res.status(500).send({message: 'ERROR GENERAL'});
                        }else if(leagueDelete){
                            res.send({message: 'Liga eliminada exitosamente'});
                        }else{
                            res.send({message: 'Error al eliminar liga'});
                        }
                    });
                }else{
                    res.status(403).send({message: 'Administrador no autorizado'});
                }             
            }else{
                res.status(403).send({message: 'Administrador no autorizado'});
            }
        })
       
    }
}
//LIST LEAGUE

//SEARCH LEAGUE 

//FUNCTIONS ROUTES
module.exports = {
deleteLeague,    
updateLeague
}