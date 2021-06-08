'use strict'

var User = require('../models/user.model');
var bcrypt = require('bcrypt-nodejs');
var jwt = require('../services/jwt');

//CREATE INIT
function createInit(req,res){
    let user = new User();
    user.password = '12345';
    user.username = 'admin';

    User.findOne({username: user.username}, (err, userFind)=>{
            if(err){
                console.log('Error general');
            }else if(userFind){
                console.log('no se puede agregar un nuevo usuario administrador');
            }else{
                bcrypt.hash(user.password, null, null, (err, passwordHash)=>{
                    if(err){
                        console.log('Error al crear el usuario');
                    }else if(passwordHash){
                       
                        user.username = 'admin'
                        user.name='admin'
                        user.role = 'ROLE_ADMIN'    
                        user.password = passwordHash;
                            
                        user.save((err, userSaved)=>{
                            
                            if(err){
                                console.log('Error al crear el usuario');
                            }else if(userSaved){
                                console.log('Usuario administrador creado');
                               
                                
                            }else{
                                console.log('Usuario administrador no creado');
                            }
                        })
                    }else{
                        console.log('No se encriptó la contraseña');
                    } 
                })
            }
    })
}

//LOGIN 

//SAVE 

//UPDATE
function updateUser(req, res){
    let userId = req.params.id;
    let update = req.body;

    if(userId != req.user.sub){
        return res.status(401).send({ message: 'No tienes permiso para realizar esta acción'});
    }else{
        if(update.password || update.role){
            return res.status(401).send({ message: 'No se puede actualizar la contraseña ni el rol desde esta función'});
        }else{
            if(update.username){
                User.findOne({username: update.username.toLowerCase()}, (err, userFind)=>{
                    if(err){
                        return res.status(500).send({ message: 'Error general'});
                    }else if(userFind){
                        if(userFind._id == req.user.sub){
                            User.findByIdAndUpdate(userId, update, {new: true}, (err, userUpdated)=>{
                                if(err){
                                    return res.status(500).send({message: 'Error general al actualizar'});
                                }else if(userUpdated){
                                    return res.send({message: 'Usuario actualizado', userUpdated});
                                }else{
                                    return res.send({message: 'No se pudo actualizar al usuario'});
                                }
                            })
                        }else{
                            return res.send({message: 'Nombre de usuario ya en uso'});
                        }
                    }else{
                        User.findByIdAndUpdate(userId, update, {new: true}, (err, userUpdated)=>{
                            if(err){
                                return res.status(500).send({message: 'Error general al actualizar'});
                            }else if(userUpdated){
                                return res.send({message: 'Usuario actualizado', userUpdated});
                            }else{
                                return res.send({message: 'No se pudo actualizar al usuario'});
                            }
                        })
                    }
                })
            }else{
                User.findByIdAndUpdate(userId, update, {new: true}, (err, userUpdated)=>{
                    if(err){
                        return res.status(500).send({message: 'Error general al actualizar'});
                    }else if(userUpdated){
                        return res.send({message: 'Usuario actualizado', userUpdated});
                    }else{
                        return res.send({message: 'No se pudo actualizar al usuario'});
                    }
                })
            }
        }
    }
    
}

//DELETE 
function deleteUser(req, res){
    let userId = req.params.idU;
    let params = req.body;
    if(userId !=req.user.sub){
        return res.status(403).send({message: 'No tienes permisos para realizar esta acción'})
    }else{
        User.findById(userId, (err, userFind)=>{
            if(err){
                res.status(500).send({message: 'Error general'})
            }else if(userFind){
                if(params.password){
                    bcrypt.compare(params.password, userFind.password, (err, passwordCheck)=>{
                        if(err){
                            res.status(500).send({message: 'Error general', err})
                        }else if(passwordCheck){
                                User.findByIdAndRemove(userId, (err, userFind)=>{
                                    if(err){
                                        res.status(500).send({message: 'Error general'})
                                    }else if(userFind){
                                        res.status(200).send({message: 'Eliminado exitosamente'})
                                    }else{
                                        res.status(403).send({message: 'Error al eliminar'})
                                    }
                                })
                        }else{
                            res.status(403).send({message: 'Contraseña incorrecta'})
                        }
                    })
                }else{
                    res.status(200).send({message:'Ingrese la contraseña del usuario para eliminar'})
                }
            }else{
                res.status(403).send({message: 'Usuario inexistente'})
            }

        })
    }
}
//SEARCH

//LIST

//UPLOAD IMAGE
function uploadImage(req, res){
    var userId = req.params.id;
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
                    User.findByIdAndUpdate(userId, {image: fileName}, {new:true}, (err, userUpdated)=>{
                        if(err){
                            return res.status(500).send({message: 'Error general'});
                        }else if(userUpdated){
                            return res.send({user: userUpdated, userImage: userUpdated.image});
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

function getImage(req, res){
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

//FUNCTIONS ROUTES
module.exports = {
    deleteUser,
    updateUser,
    uploadImage,
    getImage
}





































































































































































































