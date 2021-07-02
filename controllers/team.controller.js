'use strict'
var Team = require('../models/team.model');
var League = require('../models/league.model');
var User = require('../models/user.model');
var jwt = require('../services/jwt');
var fs = require('fs');
var path = require('path');
//SAVE TEAM 
function saveTeam (req, res){
    var team = new Team();
    var params = req.body;
    let userId = req.params.id; 

    if(userId !=req.user.sub){
        res.status(403).send({message: 'No puede acceder a esta funcion'})
    }else{
        if(params.name){
            Team.findOne({name: params.name}, (err, teamFind)=>{
                if(err){
                    res.status(500).send({message: 'ERROR GENERAL', err})
                }else if(teamFind){
                    res.status(200).send({message: 'Nombre del equipo en uso'})
                }else{
                    team.name = params.name;
                    team.icon = params.icon;
                    team.admin =  userId;
                    team.points = 0;
                    team.gf = 0;
                    team.gc = 0;
                    team.diference = 0;
                    team.matches = 0;
                    team.save((err, teamSaved)=>{
                        if(err){
                            res.status(500).send({message: 'ERROR GENERAL', err})
                        }else if(teamSaved){    
                          
                                
                                    res.status(200).send({message: 'Equipo registrado con éxito', teamSaved}) 
    
                         
                        }else{
                            res.status(401).send({message: 'No se pudo registrar el equipo'})
                        }
                    })                      
                }
            })
        }else{
            res.status(401).send({message: 'Ingrese los datos minimos para el registro'})
        }
    }
}
//UPDATE TEAM
function updateTeam(req, res){
    let team = req.params.idT;
    let update = req.body;
    let userId = req.params.idU;
    if(userId !=req.user.sub){
        res.status(403).send({message: 'No puede acceder a esta funcion'})
    }else{
        User.findById(userId, (err, adminFind)=>{
            if(err){
                res.status(500).send({message: 'ERROR GENERAL', err});
            }else if(adminFind){
                Team.findById(team, (err, teamFind)=>{
                    if(err){
                        res.status(500).send({message: 'ERROR GENRAL', err});
                    }else if(teamFind){
                        if(teamFind.admin == userId){
                            Team.findByIdAndUpdate(team, update, {new: true}, (err, teamUpdated)=>{
                                if(err){
                                    res.status(500).send({message: 'ERROR GENRAL', err});
                                }else if(teamUpdated){
                                    res.send({message:'El grupo fue actualizado..', teamUpdated, adminFind});
                                }else{
                                    res.status(404).send({message: 'grupo no actualizado'});
                                }
                            });
                        }else{
                            res.status(403).send({message: 'Administrador no autorizado..'});
                        }
                    }else{
                        res.status(404).send({message: 'grupo no actualizado'});
                    }
                })
               
            }else{
                res.status(403).send({message: 'Administrador no autorizado'});
            }
        })
           
    }
}
//DELETE TEAM
function deleteTeam(req, res){
    let userId = req.params.idU;
    let leagueId = req.params.idL;
    let teamId = req.params.idT;

    if(userId != req.user.sub){
        res.status(500).send({message: 'No puedes acceder a esta funcion'})
    }else{
        Team.findByIdAndRemove(teamId, (err, teamRemoved)=>{
            if(err){
                return res.status(500).send({message: 'Error general', err})
            }else if(teamRemoved){
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
                               return res.status.send({message:'Equipo eliminado exitosamente', teamPull})
                           }else{
                               return res.status(404).send({message: 'Eliminado de la base de datos, aun existente en Liga'})
                           }
                       }).populate('team')
               
                       }else{
                           res.status(418).send({message: 'Usuario no permitido'});   
                       }
                    }else{
                        res.status(404).send({message: 'Eliminado de la base de datos pero no de la liga'});
                    }
                })
            }else{
                return res.status(404).send({message: 'Registro no encontrado o Equipo ya eliminado'})
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
            res.status(200).send({message: 'Equipos encontrados', team})
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

//UPLOEAD IMAGE
function uploadImageT(req, res){
    var userId = req.params.id;
    var teamId = req.params.idT;
    var fileName = 'Sin imagen';
    if(userId != req.user.sub){
        res.status(403).send({message: 'No puede acceder a esta funcion'});
    }else{
        if(req.files){
            var filePath = req.files.icon.path;
            var fileSplit = filePath.split('\\');
            var fileName = fileSplit[2];
            var ext = fileName.split('.');
            var fileExt = ext[1];
            if( fileExt == 'png' ||
                fileExt == 'jpg' || 
                fileExt == 'jpeg' ||
                fileExt == 'gif'){
                    Team.findByIdAndUpdate(teamId, {icon: fileName}, {new:true}, (err, teamUpdated)=>{
                        if(err){
                            return res.status(500).send({message: 'Error general'});
                        }else if(teamUpdated){
                            return res.send({team: teamUpdated, teamImage: teamUpdated.icon});
                        }else{
                            return res.status(404).send({message: 'No se actualizó la imagen'});
                        }
                    })
                }else{
                    fs.unlink(filePath, (err)=>{
                        if(err){
                            return res.status(500).send({message: 'Error al eliminar y la extensión no es válida'});
                        }else{
                            return res.status(403).send({message: 'Extensión no válida, y archivo eliminado'});
                        }
                    })
                }
        }else{
            return res.status(404).send({message: 'No has subido una imagen'});
        }
    }
} 

function getImageT(req, res){
    var fileName = req.params.fileName;
    var pathFile = './uploads/users/' + fileName;
    fs.exists(pathFile, (exists)=>{
        if(exists){
            return res.sendFile(path.resolve(pathFile))
        }else{
           return res.status(404).send({message: 'Imagen inexistente'});
        }
    })
}

function setTeam (req,res){
    var teamId = req.params.idT;
    var leagueId = req.params.idL;
    var userId = req.params.idU;
    if(userId != req.user.sub){
        res.status(403).send({message: 'No puede acceder a esta funcion'});
    }else{
        User.findById(userId, (err,userFind)=>{
            if (err) {
                res.status(500).send({message: 'Error general'});
            }else if (userFind) {
                League.findById(leagueId, (err, leagueFind)=>{
                    if (err) {
                        res.status(500).send({message: 'Error general'});
                    }else if (leagueFind) {
                        if (leagueFind.admin == userId) {
                            League.findOneAndUpdate(leagueId, {$push:{teams: teamId}}, {new: true}, (err, pushTeam)=>{
                                if(err){
                                    res.status(500).send({message: 'Error general al setear el contacto'});
                                }else if(pushTeam){
                                    return res.status(200).send({message: 'Team guardado correctamente', pushTeam});
                                }else{
                                    res.status(200).send({message: 'no seteado pero en la base de datos'});
                                }
                            }) 
                        }else{
                            res.status(200).send({message: 'Usuario no autorizado'});
                        }      
                    }else{
                        res.status(200).send({message: 'Liga no econtrada'});
                    }
                })       
            }else{
                res.status(200).send({message: 'Usuario no encontrado'});
            }
        })
    }
}

//FUNCTIONS ROUTES
module.exports = {
    deleteTeam,
    getTeams,
    searchTeam,
    saveTeam,
    uploadImageT,
    getImageT,
    updateTeam,
    setTeam

}        