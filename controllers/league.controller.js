'use strict'
var League = require('../models/league.model');
var jwt = require('../services/jwt');

//SAVE LEAGUE

//UPDATE LEAGUE

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
    deleteLeague
}