import {texture} from "./texture.js";
import {shader} from "./shader.js";
import {matr} from "../../../mth/math.js";

export class material {
    constructor() {
        this.textures = [];
    }

    async create(shdName) {
        this.shd = new shader();
        let tmp = await this.shd.create(shdName);
        return tmp;
    }

    uniSet(uniId, val)
    {
        let uniLoc = uniId;
        if (typeof uniId == 'string')
            uniLoc = window.gl.getUniformLocation(this.shd.shaderProgram, uniId);
        if (uniLoc == null)
            return;
        switch (typeof val) {
            case 'num':
                if (val.isInteger())
                    window.gl.uniform1i(uniLoc, val);
                else
                    window.gl.uniform1f(uniLoc, val);
                break;
            case 'boolean':
                window.gl.uniform1i(uniLoc, val);
            case 'object':
                if (val instanceof matr)
                    window.gl.uniformMatrix4fv(uniLoc, false, new Float32Array(val.Data)); 
                break;
        }
    }

    apply() {
        this.shd.apply();
        // Ka, Kd, Ks, ...
        if (this.textures != undefined)
            this.textures.forEach((tex, ind) => {
                window.gl.activeTexture(window.gl.TEXTURE0 + ind);
                window.gl.bindTexture(tex.GLtype, tex.GLtexture);
                this.uniSet("Texture" + ind, ind);
            });
    }

}