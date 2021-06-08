'use strict'

var mongoose = require('mongoose');
var app = require('./app');
var port = 3500;

mongoose.Promise = global.Promise;
mongoose.set('useFindAndModify', false);
mongoose.connect('mongodb://localhost:27017/torneosdb', {useNewUrlParser: true, useUnifiedTopology: true})
    .then(()=>{
        console.log('Conectado a Mongodb');
        //userInit.createInit();
        app.listen(port, ()=>{
            console.log('experss corriendo en:', port)
        })
    })
    .catch((err)=>console.log('Error al conectase a la base de datos', err))