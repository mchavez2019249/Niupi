'use strict'
var Team = require('../models/team.model');
var League = require('../models/league.model');
var jwt = require('../services/jwt');

//SAVE TEAM 
function saveTeam (req, res){
    var team = new Team();
    var params = req.body;
    let userId = req.params.id;
    let leagueId = req.params.idL;  

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
                    User.findOne({_id: userId}, (err, userFind)=>{
                        if(err){
                            res.status(500).send({message:'ERROR GENERAL', err})
                        }else if(userFind){
                                team.name = params.name;
                                team.icon = params.icon;
                                team.admin =  userId;                                      
                                team.save((err, teamSaved)=>{
                                    if(err){
                                        res.status(500).send({message: 'ERROR GENERAL', err})
                                    }else if(teamSaved){    
                                        League.findByIdAndUpdate(leagueId, {$push:{team: teamSaved._id}}, {new:true}, (err, teamSaved)=>{
                                            if(err){
                                                res.status(500).send({message: 'ERROR GENERAL', err})
                                            }else if(userFind){
                                                res.status(200).send({message: 'Equipo registrado con éxito', teamSaved, userFind}) 
                                            }else{
                                                res.status(401).send({message: 'No se pudo registrar el equipo'})
                                            }
                                        })
                                    }else{
                                        res.status(401).send({message: 'No se pudo registrar el equipo'})
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

//UPLOEAD IMAGE
function uploadImageT(req, res){
    var userId = req.params.id;
    var teamId = req.params.idT;
    var fileName = 'Sin imagen';

    if(userId != req.user.sub){
        res.status(403).send({message: 'No puede acceder a esta funcion'});
    }else{
        if(req.files){
            var filePath = req.files.image.path;
            var fileSplit = filePath.split('\\');
            var fileName = fileSplit[2];
            var ext = fileName.split('.');
            var fileExt = ext[1];
            if( fileExt == 'png' ||
                fileExt == 'jpg' || 
                fileExt == 'jpeg' ||
                fileExt == 'gif'){
                    Team.findByIdAndUpdate(teamId, {image: fileName}, {new:true}, (err, teamUpdated)=>{
                        if(err){
                            return res.status(500).send({message: 'Error general'});
                        }else if(teamUpdated){
                            return res.send({team: teamUpdated, userImage: teamUpdated.image});
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
    var pathFile = './uploads/teams/' + fileName;

    fs.exists(pathFile, (exists)=>{
        if(exists){
            return res.sendFile(path.resolve(pathFile))
        }else{
           return res.status(404).send({message: 'Imagen inexistente'});
        }
    })
}

//FUNCTIONS ROUTES
module.exports = {
    deleteTeam,
    getTeams,
    searchTeam,
    saveTeam,
    uploadImageT,
    getImageT
}