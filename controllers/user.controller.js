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
                                        res.status(200).send({message: 'Eliminado correctamente'})
                                    }else{
                                        res.status(403).send({message: 'NO eliminado'})
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






































































































































































































