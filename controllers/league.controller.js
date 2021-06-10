'use strict'
var League = require('../models/league.model');
var jwt = require('../services/jwt');

//SAVE LEAGUE
function saveLeague (req, res){
    var league = new League();
    var params = req.body;
    let userId = req.params.id;  
    let adminId = req.params.idA;
    if(userId !=req.user.sub){
        res.status(403).send({message: 'No puede acceder a esta funcion'})
    }else{
        if(params.name){
            League.findOne({name: params.name}, (err, leagueFind)=>{
                if(err){
                    res.status(500).send({message: 'ERROR GENERAL', err})
                }else if(leagueFind){
                    res.status(200).send({message: 'Nombre de liga en uso'})
                }else{                       
                    User.findOne({_id: adminId}, (err, adminFind)=>{
                        if(err){
                            res.status(500).send({message:'ERROR GENERAL', err})
                        }else if(adminFind){
                            if(adminFind.role!='ADMINH'){
                                res.status(200).send({message: 'Este usuario no tiene permiso para administrar la liga. Cambie el rol en los datos del usuario'})
                            }else{
                                league.name = params.name;
                                league.admin =  adminId;                                      
                                league.save((err, leagueSaved)=>{
                           if(err){
                                res.status(500).send({message: 'ERROR GENERAL', err})
                            }else if(leagueSaved){    
                                User.findById(adminId, (err, adminFind)=>{
                                    if(err){
                                        res.status(500).send({message: 'ERROR GENERAL', err})
                                    }else if(adminFind){
                                        res.status(200).send({message: 'Liga registrada con éxito', leagueSaved, adminFind}) 
                                      
                                    }else{
                                        res.status(401).send({message: 'No se pudo registrar la liga'})
                                    }

                                })
                                                                    
                            }else{
                                res.status(401).send({message: 'No se pudo registrar la liga'})
                                }
                               })                      
                            }
                        }else{
                            res.status(500).send({message:'Usuario no encontrado'})
                        }
                    })  
                }
            })   
}else{
    res.status(401).send({message: 'Ingrese los datos minimos para el registro'})
}
    }
}
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
function getLeagues(req, res){
    League.find({}).exec((err, league)=>{
        if(err){
            res.status(500).send({message: 'Error en el servidor'})
        }else if(league){
            res.status(200).send({message: 'Ligas encontradas', league})
        }else{
            res.status(200).send({message: 'No hay registros'})
        }
    }) 
}
//SEARCH LEAGUE 
function searchLeague(req, res){
    var params = req.body;
    var userId = req.params.id;
    if(userId != req.user.sub){
        res.status(500).send({message: 'No posees permisos para realizar acciones de administrador'})
    }else{
    if(params.search){
        User.find({$or:[{name: params.search}]}, (err, resultsSearch)=>{
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
    deleteLeague,    
    updateLeague,
    getLeagues,
    searchLeague,
    saveLeague
}