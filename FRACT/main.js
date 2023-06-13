import {anim} from "./anim/anim.js"

export function main(){
    window.trans_flag = false;
    window.prev_x = 0;
    window.prev_y = 0;
    window.translate_x = 0;
    window.translate_y = 0;

    window.scale = 1;
    window.scale_coeff = 1.25;    

    let animation = new anim();
}

document.onmousedown = function (e) {
    window.prev_x = e.clientX;
    window.prev_y = e.clientY;
    window.trans_flag = true;
};

document.onmouseup = function (e) {
    window.trans_flag = false;
};

document.onmousemove = function (e) {
    var CanvPos = document.getElementById("glCanvas").getBoundingClientRect();
    window.tmpMouseX = e.clientX - CanvPos.left;
    window.tmpMouseY = e.clientY - CanvPos.top;

    if (window.trans_flag) {
        window.translate_x += e.clientX - window.prev_x;
        window.translate_y += e.clientY - window.prev_y;
        window.prev_x = e.clientX;
        window.prev_y = e.clientY;
    }
};

document.onmousewheel = function (e) {
    window.mouseX = window.tmpMouseX;
    window.mouseY = window.tmpMouseY;

    if (e.deltaY > 0)
        window.scale -= 0.05;
    else
        window.scale += 0.05;
};