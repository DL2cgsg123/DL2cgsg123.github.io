import {anim} from "./anim/anim.js"

let animation;

export function main(){
    window.rot = false; 
    window.shaders = [];
    animation = new anim();
}

document.onkeydown = function (e) {
    animation.rnd.moveCam(e.keyCode);
    window.trans = false;
};

document.onmousedown = function (e) {
    window.prev_x = e.clientX;
    window.prev_y = e.clientY;
    window.rot = true; 
};

document.onmousemove = function (e) {
    if (window.rot) {
        window.mdx = e.clientX - window.prev_x;
        window.mdy = e.clientY - window.prev_y;
        window.prev_x = e.clientX;
        window.prev_y = e.clientY;   
        animation.rnd.moveCam(e.keyCode); 
    }
}

document.onmouseup = function (e) {
    window.rot = false;
};
