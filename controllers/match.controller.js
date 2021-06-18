'use strict'

var League = require('../models/league.model');
var Team = require('../models/team.model');
var Match = require ('../models/matches.model');
var jwt = require('../services/jwt');

//SAVE_MATCH
function saveMatch(req,res){
    let idTeam1 = req.params.idteam1;
    let idTeam2 = req.params.idteam2;
    let league = req.params.idLeague;
    let userId = req.params.idUser;
    let match = new Match();
    let params = req.body;

    if(userId != req.user.sub){
        return res.status(401).send({ message: 'No tienes permiso para realizar esta acción'});
    }else{
    if(team1 && team2 && league && userId){
        League.findById(league, (err, leagueFind)=>{
            if(err){
                res.status(500).send({message: 'Error general', err})
            }else if(leagueFind){
                if(leagueFind.admin==userId){
                    match.team1 = idTeam1;
                    match.team2 = idTeam2;
                    match.result1 = params.result1;
                    match.result2 = params.result2;
                    match.league = league;

                    match.save((err, matchSaved)=>{
                        if(err){
                            res.status(500).send({message: 'Error general', err})
                        }else if(matchSaved){
                            res.status(200).send({message: 'Resultado guardado correctamente'})
                        }else{
                            res.status(403).send({message: 'No se ha podido guardar el resultado'})    
                        }
                    })
                }else{
                    res.status(403).send({message: 'No tiene autorización para agregar resultados a este torneo'})    
                }
            }else{
                res.status(403).send({message: 'Liga/Torneo no encontrado'})
            }
        })

    }else{
        return res.status(401).send({message: 'Por favor envía los datos mínimos para la creación del usuario'})
    }
}

}

//DELETE_MATCH
function deleteMatch(req,res){
    

}
//LIST_MATCH listar a de mayor a menor
function listMatches(req,res){
    Team.sort({compareFunction}).exec((err, team)=>{
        if(err){
            res.status(500).send({message: 'Error en el servidor'})
        }else if(team){
            res.status(200).send({message: 'Tabla de posiciones', team})
        }else{
            res.status(200).send({message: 'No hay registros'})
        }
    }) 
}

//FUNCTIONS ROUTES
module.exports = {
    saveMatch,
    listMatches
}