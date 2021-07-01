'use strict'

var mongoose = require('mongoose');
var app = require('./app');
var port = process.env.PORT || 3500;
var userInit = require('./controllers/user.controller');
mongoose.Promise = global.Promise;
mongoose.set('useFindAndModify', false);
mongoose.connect('mongodb+srv://admin:123@bd.qkm2t.mongodb.net/BD?retryWrites=true&w=majority',
{useNewUrlParser:true, useUnifiedTopology:true})
    .then(()=>{
        console.log('Conectado a Mongodb');
        //userInit.createInit();
        app.listen(port, ()=>{
            console.log('experss corriendo en:', port)
        })
    })
    .catch((err)=>console.log('Error al conectase a la base de datos', err))