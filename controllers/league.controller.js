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

//LIST LEAGUE

//SEARCH LEAGUE 

//FUNCTIONS ROUTES
module.exports = {




updateLeague,
}