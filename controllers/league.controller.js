'use strict'
var League = require('../models/league.model');
var User = require('../models/user.model');
var jwt = require('../services/jwt');

//SAVE LEAGUE
function saveLeague (req, res){
    var league = new League();
    var params = req.body;
    let userId = req.params.id;  
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
                    User.findOne({_id: userId}, (err, userFind)=>{
                        if(err){
                            res.status(500).send({message:'ERROR GENERAL', err})
                        }else if(userFind){
                                league.name = params.name;
                                league.admin =  userId;                                      
                                league.save((err, leagueSaved)=>{
                           if(err){
                                res.status(500).send({message: 'ERROR GENERAL', err})
                            }else if(leagueSaved){    
                                User.findById(userId, (err, userFind)=>{
                                    if(err){
                                        res.status(500).send({message: 'ERROR GENERAL', err})
                                    }else if(userFind){
                                        res.status(200).send({message: 'Liga registrada con éxito', savedL: leagueSaved, userFind}) 
                                      
                                    }else{
                                        res.status(401).send({message: 'No se pudo registrar la liga'})
                                    }
                                })
                            }else{
                                res.status(401).send({message: 'No se pudo registrar la liga'})
                                }
                               })                      

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
    let leagueId = req.params.idL;
    let update = req.body;

    if(userId != req.user.sub){
        return res.status(404).send({message: 'No tienes permiso para realizar esta acción'});
    }else{
        if(update.name){
            User.findById(userId, (err, userFind)=>{
                if(err){
                    return res.status(500).send({message: 'Error general'});
                }else if(userFind){
                    League.findById(leagueId,(err, leagueFind)=>{
                        if (err) {
                            return res.status(500).send({message: 'Error general al actualizar'});
                        }else if (leagueFind) {
                            if (leagueFind.admin == userId || userFind.role == 'ROLE_ADMIN') {
                                League.findByIdAndUpdate(leagueId, update, {new: true}, (err, updateLeague)=>{
                                    if(err){
                                        return res.status(500).send({message: 'Error general al actualizar'});
                                    }else if(updateLeague){
                                        return res.send({message: 'Liga  actualizada', updateLeague});
                                    }else{
                                        return res.status(401).send({message: 'No se pudo actualizar el contacto'});
                                    }
                                })
                            }else{
                                return res.status(401).send({message: 'NO tiene autorización para actualizar esta liga'});
                            }
                        }else{
                            return res.status(401).send({message: 'No se pudo encontrar la liga solicitada'});
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
    console.log(req.params.idL, req.params.idU);
    if(adminId !=req.user.sub){
        res.status(403).send({message: 'No puede acceder a esta funcion'})
    }else{
        League.findById(idLeague, (err, leagueFind)=>{
            if(err){
                res.status(500).send({message: 'ERROR GENERAL'});
            }else if(leagueFind){
                User.findById(userId, (err, userFind)=>{
                    if (err) {
                        res.status(500).send({message: 'ERROR'});
                    }else if (userFind) {
                        if(leagueFind.admin == adminId || adminId.role == 'ROLE_ADMIN'){
                            League.findByIdAndRemove(idLeague, (err, leagueDelete)=>{
                                if(err){
                                    res.status(500).send({message: 'ERROR GENERAL'});
                                }else if(leagueDelete){
                                    res.send({message: 'Liga eliminada exitosamente',deletedL:leagueDelete});
                                }else{
                                    res.send({message: 'Error al eliminar liga'});
                                }
                            });
                        }else{
                            res.status(403).send({message: 'Administrador no autorizado'});
                        }   
                    }else{
                        res.send({message: 'admin no encontrado'});
                    }
                })
                            
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
            res.status(200).send({message: 'Ligas encontradas', leagueFind: league})
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
        League.find({$or:[{name: params.search}]}, (err, resultsSearch)=>{
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

//LIST LEAGUE BYUSER
function listLeagueU(req, res){
    let userId = req.params.id;
    if(userId != req.user.sub){
        res.status(500).send({message: 'No tienes permisos para realizar esta acción'})
    }else{
        League.find({$or: [{admin: req.params.id}]}).exec((err, leaguesFind)=>{
            if(err){
                res.status(500).send({message: 'Error en el servidor'});
            }else if(leaguesFind){
                res.send({message: 'Estas son tus ligas: ', leaguefind: leaguesFind});
            }else{
                res.status(404).send({message: 'No hay registros'});
            }
        })
    }
}

//FUNCTIONS ROUTES
module.exports = {
    deleteLeague,    
    updateLeague,
    getLeagues,
    searchLeague,
    saveLeague,
    listLeagueU
}