
// Établissement de la connexion WebSocket
//const socket = io('http://192.168.185.31:3000'); // ??
//const socket = io('http://localhost:3000'); // own computer
//const socket = io('http://192.168.239.31:3000'); // Raspberry Pi : Wifi "1234"
const socket = io('http://192.168.64.31:3000'); // Raspberry Pi : Wifi TelK

let t = 0;
var interval;
let pressedKey_v = {};
let manual = true; //variable de set du mode manuel

// ========================= Gestion du mode manuel ===========================

function set_man_on() {
    manual = true;
}
function set_man_off() {
    manual = false;
}

let manual_button = document.getElementById("manual");
manual_button.addEventListener('mouseup', () => set_man_on());
let auto_button = document.getElementById("auto");
auto_button.addEventListener('mouseup', () => set_man_off());

// ========================= Function gestion des clee ========================
function addButtonClick_visual(index) {
    pressedKey_v[index] = true;
}
function addButtonUnClick_visual(index) {
    delete pressedKey_v[index];
    t = 0;
}

let ctx_v = document.getElementById("left");
ctx_v.addEventListener('mousedown', () => addButtonClick_visual("left"));
ctx_v.addEventListener('mouseup', () => addButtonUnClick_visual("left"));
let ctx2_v = document.getElementById("top");
ctx2_v.addEventListener('mousedown', () => addButtonClick_visual("top"));
ctx2_v.addEventListener('mouseup', () => addButtonUnClick_visual("top"));
let ctx3_v = document.getElementById("bottom");
ctx3_v.addEventListener('mousedown', () => addButtonClick_visual("bottom"));
ctx3_v.addEventListener('mouseup', () => addButtonUnClick_visual("bottom"));
let ctx4_v = document.getElementById("right");
ctx4_v.addEventListener('mousedown', () => addButtonClick_visual("right"));
ctx4_v.addEventListener('mouseup', () => addButtonUnClick_visual("right"));

function update_connection() {
    console.log(pressedKey_v)
    console.log(t)
    if (pressedKey_v.left && manual) {
        if (t % 10 == 0) {
            console.log("emitting")
            socket.emit('action', "btn1:" + t.toString());
        }
    }
    if (pressedKey_v.right && manual) {
        if (t % 10 == 0) {
            socket.emit('action', "btn4:" + t.toString());
        }
    }
    if (pressedKey_v.top && manual) {
        if (t % 10 == 0) {
            socket.emit('action', "btn2:" + t.toString());
        }
    }
    if (pressedKey_v.bottom && manual) {
        if (t % 10 == 0) {
            socket.emit('action', "btn3:" + t.toString());
        }
    }
    t += 1;
}

// ============================== Wifi connection ============================




// envoie bouton cliqué
document.querySelectorAll(".but").forEach(button => {
    button.addEventListener("mousedown", () => {
        const action = button.getAttribute("data-action");
        console.log(String (action))
        if (String(action) == "aimanton"){
                socket.emit('on', String(action))
        }
        else if (String(action) == "aimantoff"){
                socket.emit("off", String(action));
        }
        else {
                interval = setInterval(function(){
                if (t != 0 && t % 10 == 0) {
                    socket.emit('action', String(action) + ":" + t.toString());
                }

                    console.log('envoie bouton :');
                    update_connection()
                }, 1);
        }
    });

    
    
    button.addEventListener("mouseup", () => {
        const action = button.getAttribute("data-action");
        clearInterval(interval);
        if (t > 0){
            t = 0;
            update_connection();
        }
    });
});

// Fermer la connexion WebSocket quand la page est fermée ou rechargée
window.addEventListener("beforeunload", () => {
    socket.close();
});

socket.on("change_state", (data) => {
	console.log(data.toString());
    console.log('receive socket_on');
    //telemetrie(data);
});
