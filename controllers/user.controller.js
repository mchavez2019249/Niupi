'use strict'

var User = require('../models/user.model');
var bcrypt = require('bcrypt-nodejs');
var jwt = require('../services/jwt');

//CREATE INIT
//prueba prueba prueba prueba prueba
//LOGIN 

//SAVE 

//UPDATE

function updateUser(req, res) {
    var userId = req.params.id;
    var update = req.body;

    if (userId != req.user.sub) {
        res.status(403).send({message: 'Error no tienes permiso para acceder a esta ruta'})
    } else {
        User.findOne({_id: req.params.id}, (err, userFind) => {
                if (err) {
                    res.status(500).send({message: 'Error general'});
                } else if (userFind) {
                    var rol = userFind.role;
                    if (rol != 'ADMIN') {
                        res.status(500).send({message: 'No puede modficar al usuario debido a que es un USER'});
                    } else {
                        User.findByIdAndUpdate(userId, update,
                             {new: true},
                             (err, userUpdated) => {
                            if (err) {
                                res.status(500).send({message: 'Error general al actualizar'});
                            } else if (userUpdated) {
                                res.status(200).send({message:'Usuario actualizado',userUpdated});
                            } else {
                                res.status(404).send({message: 'No se ha podido actualizar'});
                            }
                        })
                    }
                } else {
                    res.status(404).send({message: 'El usuario no existe'});
                }
            })
    }
};
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
    updateUser
}





































































































































































































