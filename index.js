'use strict'

var mongoose = require('mongoose');
var app = require('./app');
var port = 3500;
var userInit = require('./controllers/user.controller');

mongoose.Promise = global.Promise;
mongoose.set('useFindAndModify', false);
mongoose.connect('mongodb://localhost:27017/torneosdb', {useNewUrlParser: true, useUnifiedTopology: true})
    .then(()=>{
        console.log('Conectado a BD');
        userInit.createInit();
        app.listen(port, ()=>{
            console.log('Servidor corriendo sin problemas')
        })
    })
    .catch((err)=>console.log('Error al conectase a la BD', err))
    