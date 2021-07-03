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
                                        //Sumar puntos equipo Ganador
                                        let winnerpoint1 = 0;
                                        winnerpoint1 = team1Find.points;
                                        let wp = winnerpoint1+3;
                                        Team.findByIdAndUpdate(idTeam1, {points:wp}, (err,sumaPunto1)=>{
                                            if (err) {
                                                res.status(403).send({message: 'error general'})
                                            }else if (sumaPunto1) {
                                                //Goles a favor Equipo Ganador
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
                                                        //Goles en contra quipo Ganador
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
                                                            // Sumar partidos equipo Ganador
                                                            let matches1 = 0;
                                                            matches1 = team1Find.matches;
                                                            let m1 = matches1+1;
                                                            Team.findByIdAndUpdate(idTeam1, {matches:m1}, (err,sumaPartido1)=>{
                                                                if (err) {
                                                                    res.status(403).send({message: 'error general'})
                                                                }else if (sumaPartido1) {
                                                                    //Diferencia equipo Ganador
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
                                                                            Team.findById(idTeam2, (err,team2Find2)=>{
                                                                                if (err) {
                                                                                    res.status(403).send({message: 'error general'})
                                                                                }else if (team2Find2) {
                                                                                    //Goles en contra Perdedor
                                                                                    let gContraP = 0;
                                                                                    gContraP = team2Find2.gc;
                                                                                    let paramGolP = 0;
                                                                                    let pruebaP = Number(params.result1);
                                                                                    paramGolP = pruebaP;
                                                                                    let gcp = gContraP+paramGolP;
                                                                                    Team.findByIdAndUpdate(idTeam2, {gc:gcp}, (err,sumaGolContra2)=>{ 
                                                                                        if (err) {
                                                                                            res.status(403).send({message: 'error general'})
                                                                                        }else if (sumaGolContra2) {
                                                                                            //Goles a favor Equipo Perdedor
                                                                                            let gfavorP = 0;
                                                                                            gfavorP = team2Find2.gf;
                                                                                            let paramGolP2 = 0;
                                                                                            let pruebaP2 = Number(params.result2);
                                                                                            paramGolP2 = pruebaP2;
                                                                                            let gfp = gfavorP+paramGolP2;
                                                                                            Team.findByIdAndUpdate(idTeam2, {gf:gfp}, (err,sumaGolP2)=>{
                                                                                                if (err) {
                                                                                                    res.status(403).send({message: 'error general'})
                                                                                                }else if (sumaGolP2) {
                                                                                                    //Diferencia equipo Perdedor
                                                                                                    let diftp = 0;
                                                                                                    let difp1 = team2Find2.gf;
                                                                                                    let difp2 = team2Find2.gc;
                                                                                                    let resultp1 = Number(params.result2);
                                                                                                    let resultp2 = Number(params.result1);
                                                                                                    diftp = (difp1 + resultp1)-(difp2 + resultp2);
                                                                                                    Team.findByIdAndUpdate(idTeam2, {diference:diftp}, (err,difGolestp)=>{
                                                                                                        if (err) {
                                                                                                            res.status(500).send({message: 'Error general'})
                                                                                                        }else if (difGolestp) {
                                                                                                            //Sumar partido Equipo Perdedor
                                                                                                            let matchesP = 0;
                                                                                                            matchesP = team2Find2.matches;
                                                                                                            let mp = matchesP+1;
                                                                                                            Team.findByIdAndUpdate(idTeam2, {matches:mp}, (err,sumaPartidoP)=>{
                                                                                                                if (err) {
                                                                                                                    res.status(500).send({message: 'Error general'})
                                                                                                                }else if (sumaPartidoP) {
                                                                                                                    res.send({message: 'Equipo Ganador 1'})
                                                                                                                }else{
                                                                                                                    res.status(404).send({message: 'Partidos no sumados al equipo 2'})
                                                                                                                }
                                                                                                            })
                                                                                                            
                                                                                                        }else{
                                                                                                            res.status(404).send({message: 'Diferencia no realizada al equipo perdedor'})
                                                                                                        }
                                                                                                    })
                                                                                                    
                                                                                                }else{
                                                                                                    res.status(403).send({message: 'Goles a favor no añadidos al perdedor'})
                                                                                                }
                                                                                            })
                                                                                            
                                                                                        }else{
                                                                                            res.status(403).send({message: 'Goles en contra no sumados al equipo perdedor'})
                                                                                        } 
                                                                                    })
                                                                                }else{
                                                                                    res.status(403).send({message: 'Team 2 no encontrado'})
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
                                        //Suma de puntos equipo 2
                                        let winnerpoint2 = 0;
                                        winnerpoint2 = team2Find.points;
                                        let wp2 = winnerpoint2+3;
                                        Team.findByIdAndUpdate(idTeam2, {points:wp2}, (err,sumaPunto2)=>{
                                            if (err) {
                                                res.status(403).send({message: 'error general'})
                                            }else if (sumaPunto2) {
                                                //Suma goles a favor equipo 2
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
                                                        // Goles en contra equipo 2
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
                                                                //Sumar Partido al equipo 2
                                                                let matches2 = 0;
                                                                matches2 = team2Find.matches;
                                                                let m2 = matches2+1;
                                                                Team.findByIdAndUpdate(idTeam2, {matches:m2}, (err,sumaPartido2)=>{
                                                                if (err) {
                                                                    res.status(403).send({message: 'error general'})
                                                                }else if (sumaPartido2) {
                                                                    //Diferencia de equipo 2
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
                                                                            Team.findById(idTeam1, (err, team1Find1)=>{
                                                                                if (err) {
                                                                                    res.status(500).send({message: 'Error General'})
                                                                                }else if (team1Find1) {
                                                                                    //Goles en contra equipo Perdedor
                                                                                    let gContraP2 = 0;
                                                                                    gContraP2 = team1Find1.gc;
                                                                                    let paramGolP4 = 0;
                                                                                    let pruebaP = Number(params.result2);
                                                                                    paramGolP4 = pruebaP;
                                                                                    let gcp2 = gContraP2+paramGolP4;
                                                                                    Team.findByIdAndUpdate(idTeam1, {gc:gcp2}, (err,sumaGolContraP2)=>{
                                                                                        if (err) {
                                                                                            res.status(500).send({message: 'Error General'})
                                                                                        }else if (sumaGolContraP2) {
                                                                                            //Goles a favor equipo Perdedor
                                                                                            let gfavorP3 = 0;
                                                                                            gfavorP3 = team1Find1.gf;
                                                                                            let paramGolP3 = 0;
                                                                                            let pruebaPerdedor = Number(params.result1);
                                                                                            paramGolP3 = pruebaPerdedor;
                                                                                            let gfp2 = gfavorP3+paramGolP3;
                                                                                            Team.findByIdAndUpdate(idTeam1, {gf:gfp2}, (err,sumaGolPerdedor)=>{
                                                                                                if (err) {
                                                                                                    res.status(500).send({message: 'Error general'})
                                                                                                }else if (sumaGolPerdedor) {
                                                                                                    //Sumar partido a equipo perdedor
                                                                                                    let matchesPerdedor2 = 0;
                                                                                                    matchesPerdedor2 = team1Find1.matches;
                                                                                                    let mp2 = matchesPerdedor2+1;
                                                                                                    Team.findByIdAndUpdate(idTeam1, {matches:mp2}, (err,sumaPartidoPerdedor)=>{
                                                                                                        if (err) {
                                                                                                            res.status(500).send({message: 'Error general'})
                                                                                                        }else if (sumaPartidoPerdedor) {
                                                                                                            //Diferencia Equipo Perdedor
                                                                                                            let difPerdedor = 0;
                                                                                                            let difPerdedor1 = team1Find1.gf;
                                                                                                            let difPerdedor2 = team1Find1.gc;
                                                                                                            let resulPerdedor1 = Number(params.result1);
                                                                                                            let resulPerdedor2 = Number(params.result2);
                                                                                                            difPerdedor = (difPerdedor1 + resulPerdedor1)-(difPerdedor2 + resulPerdedor2);
                                                                                                            Team.findByIdAndUpdate(idTeam1, {diference:difPerdedor}, (err,difGolesPerdedor1)=>{
                                                                                                                if (err) {
                                                                                                                    res.status(500).send({message: 'Error general'})
                                                                                                                }else if (difGolesPerdedor1) {
                                                                                                                    res.send({message: 'Resultado guardado correctamente, Ganador Equipo 2'})
                                                                                                                }else{
                                                                                                                    res.status(404).send({message: 'Diferencia no agregada al equipo perdedor'})
                                                                                                                }
                                                                                                            })
                                                                                                            
                                                                                                        }else{
                                                                                                            res.status(404).send({message: 'Partidos no sumados al equipo perdedor'})
                                                                                                        }
                                                                                                    })
                                                                                                    
                                                                                                }else{
                                                                                                    res.status(404).send({message: 'Goles no agregados al equipo perdedor'})
                                                                                                }
                                                                                            })
                                                                                            
                                                                                        }else{
                                                                                            res.status(404).send({message: 'Goles en contra no sumados al perdedor'})
                                                                                        }
                                                                                    })
                                                                                }else{
                                                                                    res.status(500).send({message: 'No se encontro el equipo 1'})
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
                                        res.status(404).send({message: 'Equipo 2 no encontrado'})
                                    }
                                }) 
                            }else if (params.result2 == params.result1) {
                                Team.findById(idTeam1, (err, team1Find2)=>{
                                    if (err) {
                                        res.status(500).send({message: 'Error General'})
                                    }else if (team1Find2) {
                                        //Suma de puntos Team1
                                        let empatePoint1 = 0;
                                        empatePoint1 = team1Find2.points;
                                        let ep = empatePoint1+1;
                                        Team.findByIdAndUpdate(idTeam1, {points:ep}, (err,sumaPuntoEmpate1)=>{
                                            if (err) {
                                                res.status(500).send({message: 'Error general'})
                                            }else if (sumaPuntoEmpate1) {
                                                Team.findById(idTeam2, (err, team2Find2)=>{
                                                    if (err) {
                                                        res.status(500).send({message: 'Error general'})
                                                    }else if (team2Find2) {
                                                        //Suma de puntos Team2
                                                        let empatePoint2 = 0;
                                                        empatePoint2 = team2Find2.points;
                                                        let ep2 = empatePoint2+1;
                                                        Team.findByIdAndUpdate(idTeam2, {points:ep2}, (err,sumaPuntoEmpate2)=>{
                                                            if (err) {
                                                                res.status(500).send({message: 'Error general'})
                                                            }else if (sumaPuntoEmpate2) {
                                                                //Goles a favor Empate equipo 1
                                                                let gfavorEp1 = 0;
                                                                gfavorEp1 = team1Find2.gf;
                                                                let paramGolEp1 = 0;
                                                                let pruebaEp1 = Number(params.result1);
                                                                paramGolEp1 = pruebaEp1;
                                                                let gfep1 = gfavorEp1+paramGolEp1;
                                                                 Team.findByIdAndUpdate(idTeam1, {gf:gfep1}, (err,sumaGolEp1)=>{
                                                                     if (err) {
                                                                        res.status(500).send({message: 'Error general'})
                                                                     }else if (sumaGolEp1) {
                                                                        //Goles a favor Empate equipo 2
                                                                        let gfavorEp2 = 0;
                                                                        gfavorEp2 = team2Find2.gf;
                                                                        let paramGolEp2 = 0;
                                                                        let pruebaEp2 = Number(params.result2);
                                                                        paramGolEp2 = pruebaEp2;
                                                                        let gfep2 = gfavorEp2+paramGolEp2;
                                                                        Team.findByIdAndUpdate(idTeam2, {gf:gfep2}, (err,sumaGolEp2)=>{
                                                                            if (err) {
                                                                                res.status(500).send({message: 'Error general'})
                                                                            }else if (sumaGolEp2) {
                                                                                //Goles en contra equipo 1
                                                                                let gContraEp1 = 0;
                                                                                gContraEp1 = team1Find2.gc;
                                                                                let paramGolEp3 = 0;
                                                                                let pruebaEp3 = Number(params.result2);
                                                                                paramGolEp3 = pruebaEp3;
                                                                                let gcep1 = gContraEp1+paramGolEp3;
                                                                                Team.findByIdAndUpdate(idTeam1, {gc:gcep1}, (err,sumaGolContraEp1)=>{
                                                                                    if (err) {
                                                                                        res.status(500).send({message: 'Error general'})
                                                                                    }else if (sumaGolContraEp1) {
                                                                                        //Goles en contra quipo 2
                                                                                        let gContraEp2 = 0;
                                                                                        gContraEp2 = team2Find2.gc;
                                                                                        let paramGolEp4 = 0;
                                                                                        let pruebaEp4 = Number(params.result1);
                                                                                        paramGolEp4 = pruebaEp4;
                                                                                        let gcep2 = gContraEp2+paramGolEp4;
                                                                                        Team.findByIdAndUpdate(idTeam2, {gc:gcep2}, (err,sumaGolContraEp2)=>{
                                                                                            if (err) {
                                                                                                res.status(500).send({message: 'Error general'})
                                                                                            }else if (sumaGolContraEp2) {
                                                                                                //Diferencia Goles Equipo 1
                                                                                                let difEmpate1 = 0;
                                                                                                let difEp1 = team1Find2.gf;
                                                                                                let difEp2 = team1Find2.gc;
                                                                                                let resulEp1 = Number(params.result1);
                                                                                                let resulEp2 = Number(params.result2);
                                                                                                difEmpate1 = (difEp1 + resulEp1)-(difEp2 + resulEp2);
                                                                                                Team.findByIdAndUpdate(idTeam1, {diference:difEmpate1}, (err,difGolesEmpate)=>{
                                                                                                    if (err) {
                                                                                                        res.status(500).send({message: 'Error general'})
                                                                                                    }else if (difGolesEmpate) {
                                                                                                        //Diferencia Goles Equipo 2
                                                                                                        let difEmpate2 = 0;
                                                                                                        let difEp3 = team2Find2.gf;
                                                                                                        let difEp4 = team2Find2.gc;
                                                                                                        let resulEp3 = Number(params.result2);
                                                                                                        let resulEp4 = Number(params.result1);
                                                                                                        difEmpate2 = (difEp3 + resulEp3)-(difEp4 + resulEp4);
                                                                                                        Team.findByIdAndUpdate(idTeam2, {diference:difEmpate2}, (err,difGolesEmpate2)=>{
                                                                                                            if (err) {
                                                                                                                res.status(500).send({message: 'Error general'})
                                                                                                            }else if (difGolesEmpate2) {
                                                                                                                //Matches Empate Equipo 1
                                                                                                                let matchesEmpate1 = 0;
                                                                                                                matchesEmpate1 = team1Find2.matches;
                                                                                                                let mep1 = matchesEmpate1+1;
                                                                                                                Team.findByIdAndUpdate(idTeam1, {matches:mep1}, (err,sumaPartidoEmpate1)=>{
                                                                                                                    if (err) {
                                                                                                                        res.status(500).send({message: 'Error general'})
                                                                                                                    }else if (sumaPartidoEmpate1) {
                                                                                                                        //Matches Empate Equipo 2
                                                                                                                        let matchesEmpate2 = 0;
                                                                                                                        matchesEmpate2 = team2Find2.matches;
                                                                                                                        let mep2 = matchesEmpate2+1;
                                                                                                                        Team.findByIdAndUpdate(idTeam2, {matches:mep2}, (err,sumaPartidoEmpate2)=>{
                                                                                                                            if (err) {
                                                                                                                                res.status(500).send({message: 'Error general'})
                                                                                                                            }else if (sumaPartidoEmpate2) {
                                                                                                                                res.status(200).send({message: 'Resultado guardado correctamente, ¡Empate!'})
                                                                                                                            }else{
                                                                                                                                res.status(404).send({message: 'Error al sumar el match Equipo 2'})
                                                                                                                            }
                                                                                                                        })
                                                                                                                    }else{
                                                                                                                        res.status(404).send({message: 'Error al sumar el match Equipo 1'})
                                                                                                                    }
                                                                                                                })
                                                                                                                
                                                                                                            }else{
                                                                                                                res.status(404).send({message: 'Error al agregar Diferencia Goles al quipo 2'})
                                                                                                            }
                                                                                                        })
                                                                                                    }else{
                                                                                                        res.status(404).send({message: 'Error al agregar Diferencia Goles al quipo 1'})
                                                                                                    }
                                                                                                })
                                                                                                
                                                                                            }else{
                                                                                                res.status(404).send({message: 'Error al sumar goles en contra equipo 2'})
                                                                                            }
                                                                                        })
                                                                                    }else{
                                                                                        res.status(404).send({message: 'Error al sumar goles en contra equipo 1'})
                                                                                    }
                                                                                })
                                                                                
                                                                            }else{
                                                                                res.status(404).send({message: 'Error al agregar Goles a favor Equipo 2'})
                                                                            }
                                                                        })
                                                                         
                                                                     }else{
                                                                        res.status(404).send({message: 'Error al agregar Goles a favor Equipo 1'})
                                                                     }
                                                                 })
                                                                
                                                            }else{
                                                                res.status(404).send({message: 'Error al sumar los puntos de empate equipo 2'})
                                                            }
                                                        })
                                                    }else{
                                                        res.status(500).send({message: 'Error en la suma de puntos empate Equipo 1'})
                                                    }
                                                })
                                                
                                            }else{
                                                res.status(404).send({message: 'Error Suma de puntos empate'})
                                            }
                                        })
                                    }else{
                                        res.status(404).send({message: 'Equipo 1 no encontrado'})
                                    }
                                })
                               
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
/*
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
*/
/*
function listMatches(req,res){

    let leagueId = req.params.idL;
    let userId = req.params.idU;

    if(userId != req.user.sub){
        return res.status(401).send({ message: 'No tienes permiso para realizar esta acción'});
    }else{
    League.findById(leagueId, (err, leagueFind)=>{
        if(err){
            res.status(500).send({message: 'Error en el servidor', err});
        }else if(leagueFind){
           Team.findById(leagueFind.teams, (err, teamsFind)=>{
               if(err){
                res.status(500).send({message: 'Error en el servidor', err});
               }else if(teamsFind){
                function compareNumbers(a, b) {
                    return a - b;
                  }
                   let prueba = teamsFind.points; 
                    prueba.sort(compareNumbers);
               }else{
                res.status(200).send({message: 'No hay registros'});
               }
           })
        }else{
            res.status(200).send({message: 'No hay registros'});
        }
    })
}
}
*/

async function listMatches(req, res) {
    var leagueId = req.params.idL;
    let userId = req.params.idU;
    if(userId != req.user.sub){
        return res.status(401).send({ message: 'No tienes permiso para realizar esta acción'});
    }else{
    var League = await League.find({league: _id })
    await League.find({ team: League }).populate('points', 'name').exec((err, match) => {
        if (err) {
            return res.status(500).send({ mensaje: "Error en la petición" })
        } else if (!match) {
            return res.status(500).send({ mensaje: "No se ha podido obtener la tabla" })
        } else {
            return res.status(200).send({ match })
        }
    })
}
}



//FUNCTIONS ROUTES
module.exports = {
    saveMatch,
    listMatches,
    listMatches
}


