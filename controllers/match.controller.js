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
    if(params.result1 && params.result2){
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
                            if (params.result1 > params.result2) {
                                Team.findById(idTeam1, (err, team1Find)=>{
                                    if (err) {
                                        res.status(403).send({message: 'Error general'})
                                    }else if (team1Find) {
                                        let winnerpoint1 = 0;
                                        winnerpoint1 = team1Find.points;
                                        let wp = winnerpoint1+3;
                                        Team.findByIdAndUpdate(idTeam1, {points:wp}, (err,sumaPunto1)=>{
                                            if (err) {
                                                res.status(403).send({message: 'error general'})
                                            }else if (sumaPunto1) {
                                                let gfavor1 = 0;
                                                gfavor1 = team1Find.gf;
                                                let paramGol = 0;
                                                let prueba = Number(params.result1);
                                                paramGol = prueba;
                                                let gf1 = gfavor1+paramGol;
                                                Team.findByIdAndUpdate(idTeam1, {gf:gf1}, (err,sumaGol1)=>{
                                                    if (err) {
                                                        res.status(403).send({message: 'error general'})
                                                    }else if (sumaGol1) {
                                                        let gContra1 = 0;
                                                        gContra1 = team1Find.gc;
                                                        let paramGol2 = 0;
                                                        let prueba2 = Number(params.result2);
                                                        paramGol2 = prueba2;
                                                        let gc1 = gContra1+paramGol2;
                                                        Team.findByIdAndUpdate(idTeam1, {gc:gc1}, (err,sumaGolContra1)=>{
                                                            if (err) {
                                                                res.status(403).send({message: 'error general'})
                                                            }else if (sumaGolContra1) {
                                                            let matches1 = 0;
                                                            matches1 = team1Find.matches;
                                                            let m1 = matches1+1;
                                                            Team.findByIdAndUpdate(idTeam1, {matches:m1}, (err,sumaPartido1)=>{
                                                                if (err) {
                                                                    res.status(403).send({message: 'error general'})
                                                                }else if (sumaPartido1) {
                                                                    let dif = 0;
                                                                    let dif1 = team1Find.gf;
                                                                    let dif2 = team1Find.gc;
                                                                    let resul1 = Number(params.result1);
                                                                    let resul2 = Number(params.result2);
                                                                    dif = (dif1 + resul1)-(dif2 + resul2);
                                                                    Team.findByIdAndUpdate(idTeam1, {diference:dif}, (err,difGoles)=>{
                                                                        if (err) {
                                                                            res.status(403).send({message: 'Error general'})
                                                                        }else if (difGoles) {
                                                                            Team.findById(idTeam1, (err, team2Find)=>{
                                                                                if (err) {
                                                                                    res.status(404).send({message: 'error general'})
                                                                                }else if (team2Find) {
                                                                                    let gContra2 = 0;
                                                                                    gContra2 = team2Find.gc;
                                                                                     let paramGol3 = 0;
                                                                                     let prueba3 = Number(params.result1);
                                                                                     paramGol3 = prueba3;
                                                                                     let gc2 = gContra2+paramGol3;
                                                                                     Team.findByIdAndUpdate(idTeam2, {gc:gc2}, (err,restaGolContra1)=>{
                                                                                          if (err) {
                                                                                            res.status(404).send({message: 'error general'})
                                                                                         }else if (restaGolContra1) {
                                                                                            let gfavor2 = 0;
                                                                                            gfavor2 = team2Find.gf;
                                                                                            let paramGol2 = 0;
                                                                                            let prueba2 = Number(params.result2);
                                                                                            paramGol2 = prueba2;
                                                                                            let gf2 = gfavor2+paramGol2;
                                                                                            Team.findByIdAndUpdate(idTeam2, {gf:gf2}, (err,sumaGol3)=>{
                                                                                                if (err) {
                                                                                                    res.status(403).send({message:'error general'})
                                                                                                }else if (sumaGol3) {
                                                                                                    res.status(200).send({message: 'Equipo Ganador 1'})
                                                                                                }else{
                                                                                                    res.status(403).send({message:'Goles a favor no añadidos al Equipo 2'})
                                                                                                }
                                                                                            })
                                                                                            
                                                                                         }else{
                                                                                            res.status(403).send({message:'Gol en contra no guardado'})
                                                                                        }
                                                                            })
                                                                                }else{
                                                                                    res.status(404).send({message: 'Equipo 2 No encontrado'})
                                                                                }
                                                                            })
                                                                            
                                                
                                                                        }else{
                                                                            res.status(403).send({message: 'diferencia no realizada'})
                                                                        }

                                                                    })
                                                                }else{
                                                                    res.status(403).send({message: 'partido no sumado'})
                                                                }
                                                            })
                                                                
                                                            }else{
                                                                res.status(403).send({message: 'puntos gol no sumados'})
                                                            }
                                                        })
                                                    }else{
                                                        res.status(403).send({message: 'puntos gol no sumados'})
                                                    }
                                                })
                                                
                                            }else{
                                                res.status(403).send({message: 'puntos no sumados'})
                                            }
                                        })
                                    }else{
                                        res.status(403).send({message: 'Equipo 1 no encontrado'})
                                    }
                                })

                            }else if (params.result2 > params.result1) {
                                Team.findById(idTeam2, (err, team2Find)=>{
                                    if (err){
                                        res.status(403).send({message: 'Error general'})
                                    }else if (team2Find) {
                                        let winnerpoint2 = 0;
                                        winnerpoint2 = team2Find.points;
                                        let wp2 = winnerpoint2+3;
                                        Team.findByIdAndUpdate(idTeam2, {points:wp2}, (err,sumaPunto2)=>{
                                            if (err) {
                                                res.status(403).send({message: 'error general'})
                                            }else if (sumaPunto2) {
                                                let gfavor2 = 0;
                                                gfavor2 = team2Find.gf;
                                                let paramGol2 = 0;
                                                let prueba2 = Number(params.result2);
                                                paramGol2 = prueba2;
                                                let gf2 = gfavor2+paramGol2;
                                                Team.findByIdAndUpdate(idTeam2, {gf:gf2}, (err,sumaGol2)=>{
                                                    if (err) {
                                                        res.status(403).send({message: 'error general'})
                                                    }else if (sumaGol2) {
                                                        let gContra2 = 0;
                                                        gContra2 = team2Find.gc;
                                                        let paramGol3 = 0;
                                                        let prueba3 = Number(params.result1);
                                                        paramGol3 = prueba3;
                                                        let gc2 = gContra2+paramGol3;
                                                        Team.findByIdAndUpdate(idTeam2, {gc:gc2}, (err,sumaGolContra2)=>{
                                                            if (err) {
                                                                res.status(403).send({message: 'error general'})
                                                            }else if (sumaGolContra2) {
                                                            let matches2 = 0;
                                                            matches2 = team2Find.matches;
                                                            let m2 = matches2+1;
                                                            Team.findByIdAndUpdate(idTeam2, {matches:m2}, (err,sumaPartido2)=>{
                                                                if (err) {
                                                                    res.status(403).send({message: 'error general'})
                                                                }else if (sumaPartido2) {
                                                                    //componer
                                                                    let dift2 = 0;
                                                                    let dif3 = team2Find.gf;
                                                                    let dif4 = team2Find.gc;
                                                                    let resul3 = Number(params.result2);
                                                                    let resul4 = Number(params.result1);
                                                                    dift2 = (dif3 + resul3)-(dif4 + resul4);
                                                                    Team.findByIdAndUpdate(idTeam2, {diference:dift2}, (err,difGoles2)=>{
                                                                        if (err) {
                                                                            res.status(403).send({message: 'Error general'})
                                                                        }else if (difGoles2) {
                                                                            res.status(200).send({message: 'Resultado guardado correctamente, Ganador Equipo 2'})
                                                                        }else{
                                                                            res.status(403).send({message: 'diferencia no realizada'})
                                                                        }

                                                                    })
                                                                }else{
                                                                    res.status(403).send({message: 'partido no sumado'})
                                                                }
                                                            })
                                                                
                                                            }else{
                                                                res.status(403).send({message: 'puntos gol no sumados'})
                                                            }
                                                        })
                                                    }else{
                                                        res.status(403).send({message: 'puntos gol no sumados'})
                                                    }
                                                })
                                                
                                            }else{
                                                res.status(403).send({message: 'puntos no sumados'})
                                            }
                                        })
                                    }else{
                                        res.status(403).send({message: 'Equipo 2 no encontrado'})
                                    }
                                })
                               // res.status(200).send({message: 'Resultado guardado correctamente, Ganador Equipo 2'})   
                            }else if (params.result2 == params.result1) {
                               // res.status(200).send({message: 'Resultado guardado correctamente, ¡Empate!'})
                            }
                            
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
    listMatches,
    
}