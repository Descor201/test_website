let color = ('white');          // couleur de remplissage
let vec = [];                   // vecteur regroupant l'ensemble des vec du chemin

let pressedKey = {};            // ensemble des key press�es par l'utilisateur

let ax = 200;                   // coordonn�es x du robot
let ay = 200;                   // coordonn�es y du robot
orientation = 0.0;               // rotation du robot a l'instant t

let dist_roues = 1;             // donn�es de distance entre chaque roue (cm)
let diametre = 1;               // donn�es de diam�tre sur chaque roue (cm)

function setup() {
    let obj = createCanvas(400, 400);
    obj.parent("visualp");
    background(220);
}

function draw() {
    background(220);

    let ax1 = ax;
    let ay1 = ay;
    update()
    arrow(ax, ay, 10);
    vec.push([ax1, ay1, ax, ay]);

    for (let k = 0; k < vec.length; k++) {
        let v = vec[k];
        line(v[0], v[1], v[2], v[3]);
    }
}

// =================== Key Gestionnary ===================

function keyPressed() {
    pressedKey[key] = true;
}

function keyReleased() {
    delete pressedKey[key];
}

function update() {
    if (pressedKey.z) {
        convert_speed(5, 5);
    }
    if (pressedKey.top) {
        convert_speed(5, 5);
    }
    if (pressedKey.q) {
        convert_speed(0, 5);
    }
    if (pressedKey.left) {
        convert_speed(0, 5);
    }
    if (pressedKey.s) {
        convert_speed(-5, -5);
    }
    if (pressedKey.bottom) {
        convert_speed(-5, -5);
    }
    if (pressedKey.d) {
        convert_speed(5, 0);
    }
    if (pressedKey.right) {
        convert_speed(5, 0);
    }
}

let ctx = document.getElementById("left");
ctx.addEventListener('mousedown', () => addButtonClick("left"));
ctx.addEventListener('mouseup', () => addButtonUnClick("left"));
let ctx2 = document.getElementById("top");
ctx2.addEventListener('mousedown', () => addButtonClick("top"));
ctx2.addEventListener('mouseup', () => addButtonUnClick("top"));
let ctx3 = document.getElementById("bottom");
ctx3.addEventListener('mousedown', () => addButtonClick("bottom"));
ctx3.addEventListener('mouseup', () => addButtonUnClick("bottom"));
let ctx4 = document.getElementById("right");
ctx4.addEventListener('mousedown', () => addButtonClick("right"));
ctx4.addEventListener('mouseup', () => addButtonUnClick("right"));

function addButtonClick(index) {
    pressedKey[index] = true;
}
function addButtonUnClick(index) {
    delete pressedKey[index];
}

// =================== Calculating ===================

function convert_speed(mvx, mvy) {
    orientation += (mvx - mvy) / 50;
    orientation %= 6.2;
    ax += (((mvx)) * cos(orientation) + ((mvy)) * cos(orientation)) / 3;
    ay += (((mvx) / 2) * sin(orientation) + ((mvy) / 2) * sin(orientation)) / 3;
}

// =================== Drawing ===================
function set_color_b() {
    color = ('black');
    fill(color);
}

function set_color_w() {
    color = ('white');
    fill(color);
}

function arrow(x, y, size) {
    set_color_b();
    ellipse(x, y, size, size);
    set_color_w();
}

function add_line(x1, y1, x2, y2, px, py) {
    set_color_b();
    vec.push((x1 + px, y1 + py, x2 + px, y2 + py));
    line(x1 + px, y1 + py, x2 + px, y2 + py);
    set_color_w();
}