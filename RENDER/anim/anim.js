import {render} from "./rnd/render.js"

export class anim{
    constructor(){
        this.rnd = new render();
        this.rnd.startGL();
    }
}

