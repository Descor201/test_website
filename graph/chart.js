let g_1 = null;
let g_2 = null;
let g_3 = null;
let g_4 = null;

let pressedKeyG = {}; // test pour les clee laissées pressées

function main() {
    let g1 = appli_speed("graph1");             // Graph of the linear speed
    g_1 = g1;
    let g2 = appli_speed_roues("graph2");       // Graph of the wheels speed
    g_2 = g2;
    let g3 = appli_capteurs_under("graph3");    // Graph of the encoders
    g_3 = g3;
    let g4 = appli_angulaire("graph4");         // Graph of the angular speed
    g_4 = g4;

    let dist_roues = 1;             // données de distance entre chaque roue (cm)
    let diametre = 1;               // données de diamètre sur chaque roue (cm)

    for (let pas = 1; pas < 30; pas++) {
        let c1 = getRandomInt(2);           //capteur 1 (left)
        if (pas % 4 != 0) {
            c1 = 0;
        }
        let c2 = getRandomInt(2);           //capteur 2 (right)
        if (pas % 8 != 0) {
            c2 = 0;
        }
        //utilisation des valeurs des capteurs pour dans un schéma idéale faire tourner les roues dans le bon sens
        let eq = 0;
        if (c1 == 1) {
            eq = 3;
        }
        else if (c2 == 1) {
            eq = 2;
        }
        if (c1 == c2) {
            eq = 1;
        }

        let res = get_value(180, diametre, dist_roues, eq);           //calcul des valeurs
        let x = res[0];                        //vitesse roue gauche
        let y = res[1];                        //vitesse roue droite
        let linear = res[2];                   //vitesse linéaire
        let ang = res[3];                      //vitesse angulaire

        //console.log("x : " + x);
        //console.log("y : " + y);
        //console.log("linear : " + linear);
        //console.log("angular : " + ang);
        add_value_G(g1, g1.data, pas, [linear], 30);    //Ajout des valeurs de vitesse linéaire dans le graph 1
        add_value_G(g2, g2.data, pas, [x, y], 30);      //Ajout des valeurs de vitesse des roues dans le graph 2
        add_value_G(g3, g3.data, pas, [c1, c2], 30);    //Ajout des valeurs de retour des capteur dans le graph 3
        add_value_G(g4, g4.data, pas, [ang], 30);       //Ajout des valeurs de vitesse angulaire dans le graph 4
    }
}

function create_graph(data, name) {
    /*
        Function that create a graph from a canvas name and a data list :
        data.type = struct data
        name.type = string of the canvas id
        return Graph
    */
    let ctx = document.getElementById(name).getContext('2d');
    let mychart = new Chart(ctx, {
        type: 'line',
        data: data,
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
    return mychart;
}

function getRandomInt(max) {
    /*
        Function that create random number with a maximum :
        max.type = int of the maximum
        return int
    */
    return Math.floor(Math.random() * max);
}

function get_value(max, diametre, dist_weels, eq) {
    /*
        Function that create random situation on the robot with a maximum of rotation :
        max.type = int of the maximum
        diametre.type = int of the size of the wheels
        dist_weels.type = int of the distance between the wheels
        eq.type = int of the equality from the wheels movement (0 = alea, 1 = equal, 2 = left, 3 = right)
        return list (list[int])
    */

    let delta_time = 1;                             //ecart entre 2 appels en secondes
    let movex = getRandomInt(max);                  //mouvement de la roue x
    let movey = getRandomInt(max);                  //mouvement de la roue y
    if (eq == 1) {
        movex = 60;
        movey = 60;
    }
    if (eq == 2) {
        movex = 0;
        movey = 90;
    }
    if (eq == 3) {
        movex = 90;
        movey = 0;
    }

    let speedx = (movex * diametre) / delta_time;   //vitesse de la roue x
    let speedy = (movey * diametre) / delta_time;   //vitesse de la roue y
    /*if (movey < movex) {// <!--Need to correct with ancian values, if incorrect (x is not the ancian value of y)-->
        speedy = (movey + (delta_encode - movex)) / delta_time;
    }*/
    let linear_speed = (speedy + speedx) / 2;       //vitesse linéaire
    let angular_speed = (dist_weels / 2) * ((speedx + speedy) / (speedx - speedy)); //vitesse angulaire
    if (speedy == speedx) { // éviter les infinis
        angular_speed = 0;
    }
    return [speedx, speedy, linear_speed, angular_speed];
}

function add_value_G(c, data, pas, values, max) {
    /*
        Function that update a graph from a value list and a maximum size:
        c.type = Graph (the graph to update)
        data.type = struct data
        pas.type = int (the indice of the values)
        values.type = list of the values (list[int])
        max.type = int of the maximum of values that contains the graph
        return None
    */
    data.labels.push(pas.toString());
    for (let k = 0; k < values.length; k++) {
        data.datasets[k].data.push(values[k]);
        if (data.datasets[k].data.lentgh > max) {
            let a = 0;
        }
        else {
            L = [];
            Llab = [];
            for (let i = 0; i < max; i++) {
                L.push(data.datasets[k].data.pop());
                Llab.push(data.labels.pop());
            }
            while (data.datasets[k].data.length > 0) {
                data.datasets[k].data.pop();
                data.labels.pop();
            }
            for (let i = 0; i < max; i++) {
                data.datasets[k].data.push(L.pop());
                data.labels.push(Llab.pop());
            }
        }
    }
    c.update('active');
}

function appli_speed(name) {
    /*
        Function that use the graph 01:
        name.type = string of the id of the graph
        return None
    */
    let data =
    {
        labels: ['0'],
        datasets:
            [
                {
                    label: 'vitesse lineaire',
                    data: [0],
                    backgroungColor: 'rgba(255, 255, 255, 255)',
                    borderColor: 'rgba(200, 0, 0, 255)',
                    borderWith: 1
                }
            ]
    }
    let c = create_graph(data, name);
    return c;
}

function appli_speed_roues(name) {
    /*
        Function that use the graph 02:
        name.type = string of the id of the graph
        return Graph
    */
    let data =
    {
        labels: ['0'],
        datasets:
            [
                {
                    label: 'roue 1',
                    data: [0],
                    backgroungColor: 'rgba(255, 255, 255, 255)',
                    borderColor: 'rgba(0, 200, 0, 255)',
                    borderWith: 1
                },
                {
                    label: 'roue 2',
                    data: [0],
                    backgroungColor: 'rgba(255, 255, 255, 255)',
                    borderColor: 'rgba(0, 0, 200, 255)',
                    borderWith: 1
                }
            ]
    }
    let c = create_graph(data, name);
    return c;
}

function appli_capteurs_under(name) {
    /*
        Function that use the graph 03:
        name.type = string of the id of the graph
        return None
    */
    let data =
    {
        labels: ['0'],
        datasets:
            [
                {
                    label: 'gauche',
                    data: [0],
                    backgroungColor: 'rgba(255, 255, 255, 255)',
                    borderColor: 'rgba(0, 200, 0, 255)',
                    borderWith: 1
                },
                {
                    label: 'droit',
                    data: [0],
                    backgroungColor: 'rgba(255, 255, 255, 255)',
                    borderColor: 'rgba(0, 0, 200, 255)',
                    borderWith: 1
                }
            ]
    }
    let c = create_graph(data, name);
    return c;
}

function appli_angulaire(name) {
    /*
        Function that use the graph 04 to show the angular speed
        name.type = string of the id of the graph
        return None
    */
    let data =
    {
        labels: ['0'],
        datasets:
            [
                {
                    label: 'vitesse angulaire',
                    data: [0],
                    backgroungColor: 'rgba(255, 255, 255, 255)',
                    borderColor: 'rgba(200, 0, 0, 255)',
                    borderWith: 1
                }
            ]
    }
    let c = create_graph(data, name);
    return c;
}


// ========= implemetation des boutons ==========

function main2() {
    let diametre = 1;
    let dist_wheels = 1;
    //Recuperation des graphs
    let ctx = g_1;
    let ctx2 = g_2;
    let ctx3 = g_3;
    let ctx4 = g_4;

    //définition des actions des boutons
    let btn1 = document.getElementById("top");
    /*
    btn1.addEventListener("mouseup", function () {
        btn1.className = "release";
    })*/
    btn1.addEventListener("mousedown", function () {
        //btn1.className = "hold";
        forward(ctx, ctx2, ctx3, ctx4, diametre, dist_wheels, btn1);
    })

    let btn2 = document.getElementById("bottom");
    /*
    btn2.addEventListener("mouseup", function () {
        btn2.className = "release";
    })
    */
    btn2.addEventListener("mousedown", function () {
        backward(ctx, ctx2, ctx3, ctx4, diametre, dist_wheels);
    })

    let btn3 = document.getElementById("right");
    /*
    btn3.addEventListener("mouseup", function () {
        btn3.className = "release";
    })
    */
    btn3.addEventListener("mousedown", function () {
        right(ctx, ctx2, ctx3, ctx4, diametre, dist_wheels);
    })

    let btn4 = document.getElementById("left");
    /*
    btn4.addEventListener("mouseup", function () {
        btn4.className = "release";
    })
    */
    btn4.addEventListener("mousedown", function () {
        left(ctx, ctx2, ctx3, ctx4, diametre, dist_wheels);
    })
}

function forward(g1, g2, g3, g4, diametre, dist_wheels, btn) {
    /*
        Function that add a value in the graph to keep the prototype moving forward
        g1.type = graph of the linear speed
        g2.type = graph of the speed of each wheel
        g3.type = graph of the result from the encodeurs
        g4.type = graph of the angular speed
        diametre.type = int (the size of a wheel)
        dist_wheels.type = int (distance between 2 wheels)
        btn.typer = button
        return None
    */
    let act = set_value(180, diametre, dist_wheels, 1);
    add_value_G2(g1, g1.data, (parseInt(g1.data.labels[g1.data.labels.length - 1]) + 1), [act[2]], 30);
    add_value_G2(g2, g2.data, (parseInt(g2.data.labels[g2.data.labels.length - 1]) + 1), [act[0], act[1]], 30);
    add_value_G2(g3, g3.data, (parseInt(g3.data.labels[g3.data.labels.length - 1]) + 1), [0, 0], 30);
    add_value_G2(g4, g4.data, (parseInt(g4.data.labels[g4.data.labels.length - 1]) + 1), [act[3]], 30);


    /*
     * var mousedownTimeout;

    document.body.onmousedown = function () {
        forward(g1, g2, g3, g4, diametre, dist_wheels, btn);
    }
    //function () {mousedownTimeout = window.setTimeout(function () { forward(g1, g2, g3, g4, diametre, dist_wheels, btn) }, 20000);}

    document.body.onmouseup = function () {
        window.clearTimeout(mousedownTimeout);
    }
    */
}

function backward(g1, g2, g3, g4, diametre, dist_wheels) {
    /*
        Function that add a value in the graph to keep the prototype moving backward
        g1.type = graph of the linear speed
        g2.type = graph of the speed of each wheel
        g3.type = graph of the result from the encodeurs
        g4.type = graph of the angular speed
        diametre.type = int (the size of a wheel)
        dist_wheels.type = int (distance between 2 wheels)
        return None
    */
    let act = set_value(180, diametre, dist_wheels, 4);
    add_value_G2(g1, g1.data, (parseInt(g1.data.labels[g1.data.labels.length - 1]) + 1), [act[2]], 30);
    add_value_G2(g2, g2.data, (parseInt(g2.data.labels[g2.data.labels.length - 1]) + 1), [act[0], act[1]], 30);
    add_value_G2(g3, g3.data, (parseInt(g3.data.labels[g3.data.labels.length - 1]) + 1), [0, 0], 30);
    add_value_G2(g4, g4.data, (parseInt(g4.data.labels[g4.data.labels.length - 1]) + 1), [act[3]], 30);
}

function right(g1, g2, g3, g4, diametre, dist_wheels) {
    /*
        Function that add a value in the graph to keep the prototype turning to the right
        g1.type = graph of the linear speed
        g2.type = graph of the speed of each wheel
        g3.type = graph of the result from the encodeurs
        g4.type = graph of the angular speed
        diametre.type = int (the size of a wheel)
        dist_wheels.type = int (distance between 2 wheels)
        return None
    */
    let act = set_value(180, diametre, dist_wheels, 3);
    add_value_G2(g1, g1.data, (parseInt(g1.data.labels[g1.data.labels.length - 1]) + 1), [act[2]], 30);
    add_value_G2(g2, g2.data, (parseInt(g2.data.labels[g2.data.labels.length - 1]) + 1), [act[0], act[1]], 30);
    add_value_G2(g3, g3.data, (parseInt(g3.data.labels[g3.data.labels.length - 1]) + 1), [0, 0], 30);
    add_value_G2(g4, g4.data, (parseInt(g4.data.labels[g4.data.labels.length - 1]) + 1), [act[3]], 30);
}

function left(g1, g2, g3, g4, diametre, dist_wheels) {
    /*
        Function that add a value in the graph to keep the prototype turning to the left
        g1.type = graph of the linear speed
        g2.type = graph of the speed of each wheel
        g3.type = graph of the result from the encodeurs
        g4.type = graph of the angular speed
        diametre.type = int (the size of a wheel)
        dist_wheels.type = int (distance between 2 wheels)
        return None
    */
    let act = set_value(180, diametre, dist_wheels, 2);
    add_value_G2(g1, g1.data, (parseInt(g1.data.labels[g1.data.labels.length - 1]) + 1), [act[2]], 30);
    add_value_G2(g2, g2.data, (parseInt(g2.data.labels[g2.data.labels.length - 1]) + 1), [act[0], act[1]], 30);
    add_value_G2(g3, g3.data, (parseInt(g3.data.labels[g3.data.labels.length - 1]) + 1), [0, 0], 30);
    add_value_G2(g4, g4.data, (parseInt(g4.data.labels[g4.data.labels.length - 1]) + 1), [act[3]], 30);
}

function set_value(max, diametre, dist_weels, eq) {
    /*
        Function that create random situation on the robot with a maximum of rotation :
        max.type = int of the maximum
        diametre.type = int of the size of the wheels
        dist_weels.type = int of the distance between the wheels
        eq.type = int of the equality from the wheels movement (0 = alea, 1 = forward, 2 = left, 3 = right, 4 = backward)
        return list (list[int])
    */
    let delta_encode = max;
    let delta_time = 1;
    let movex = getRandomInt(max);
    let movey = getRandomInt(max);
    if (eq == 1) {
        movex = 60;
        movey = 60;
    }
    if (eq == 2) {
        movex = 0;
        movey = 90;
    }
    if (eq == 3) {
        movex = 90;
        movey = 0;
    }
    if (eq == 4) {
        movex = -60;
        movey = -60;
    }

    let speedx = (movex * diametre) / delta_time;
    let speedy = (movey * diametre) / delta_time;
    /*if (movey < movex) {                                                  // Need to correct with ancian values, if incorrect (x is not the ancian value of y)
        speedy = (movey + (delta_encode - movex)) / delta_time;
    }*/
    let linear_speed = (speedy + speedx) / 2;
    let angular_speed = (dist_weels / 2) * ((speedx + speedy) / (speedx - speedy));
    //console.log("ang speed" + angular_speed + "\nsp x" + speedx + "\nsp y" + speedy + "\n x" + movex + "\n y" + movey);
    if (speedy == speedx) {
        angular_speed = 0;
    }
    return [speedx, speedy, linear_speed, angular_speed];
}

function add_value_G2(c, data, pas, values, max) {
    /*
        Function that update a graph from a value list and a maximum size:
        c.type = Graph (the graph to update)
        data.type = struct data
        pas.type = int (the indice of the values)
        values.type = list of the values (list[int])
        max.type = int of the maximum of values that contains the graph
        return None
    */
    data.labels.push(pas.toString());
    for (let k = 0; k < values.length; k++) {
        data.datasets[k].data.push(values[k]);
        if (data.datasets[k].data.lentgh > max) {
            let a = 0;
        }
        else {
            L = [];
            Llab = [];
            for (let i = 0; i < max; i++) {
                L.push(data.datasets[k].data.pop());
                Llab.push(data.labels.pop());
            }
            while (data.datasets[k].data.length > 0) {
                data.datasets[k].data.pop();
                data.labels.pop();
            }
            for (let i = 0; i < max; i++) {
                data.datasets[k].data.push(L.pop());
                data.labels.push(Llab.pop());
            }
        }
    }
    c.update('active');
}

// ========= activate the main functions ========
main()
main2()