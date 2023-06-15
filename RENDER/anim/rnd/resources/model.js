import {matr, vec3} from '../../../mth/math.js'
import {primitive} from './primitive.js'

export class model {
    constructor() {
      this.prims = [];
    }

    async loadJSON(fName) {
        try {
          const responce = await fetch(fName);
          const res = await responce.json();
          return res;
        } catch (err) {
          console.error(err);
        }
      }   

    async loadBIN(fName) {
      try {
        const responce = await fetch(fName);
        const data = await responce.arrayBuffer();
        return data;
      } catch (err) {
        console.error(err);
      }
    
    }

    loadAttrib(data, bin, accesInd, type)
    {
      if (accesInd == undefined || accesInd < 0)
        return;
      let bufferView = data.bufferViews[data.accessors[accesInd].bufferView];

      let i, j;
      let shift = bufferView.byteOffset;
      if (shift == undefined)
        shift = 0;
      return new type(bin, shift, Math.floor(bufferView.byteLength / type.BYTES_PER_ELEMENT));
    }
    
    childMatr() {

    }

    async loadGLTF(name, shdName) {
      let data = await this.loadJSON("../../bin/models/" + name + "/" + name + ".gltf");
      let bin = await this.loadBIN("../../bin/models/" + name + "/" + name + ".bin");
      /* Check number of the model scenes */
      if (data.scenes.length > 1) {
        console.log("Problem: too much scenes!");
        return;
      }

      /* Load meshes */
      let Result = [];
      let i, j;
      for (i = 0; i < data.meshes.length; i++) {
        for (j = 0; j < data.meshes[i].primitives.length; j++) {
            let prim = new primitive();
            let attrib = data.meshes[i].primitives[j].attributes;

            /* Load mesh data arrays */
            let P = this.loadAttrib(data, bin, attrib.POSITION, Float32Array);
            let N = this.loadAttrib(data, bin, attrib.NORMAL, Float32Array);
            let T = this.loadAttrib(data, bin, attrib.TEXCOORD_0, Float32Array);
            let I = this.loadAttrib(data, bin, data.meshes[i].primitives[j].indices, Uint16Array);

            let mode = window.gl.TRIANGLES;
            if (data.meshes[i].primitives[j].mode != undefined)
              mode = data.meshes[i].primitives[j].mode;
            Result.push(await prim.create(mode, P, T, N, I, shdName));
            this.prims.push(prim);
        }
      }
      /* Find nodes dependances */
      let nodes = data.nodes;
      for (let i = 0; i < nodes.length; i++) {
        let 
          trans = matr.identity(),
          rot = matr.identity(),
          scale = matr.identity();
        if (nodes[i].translation != undefined)
          trans = matr.translate(new vec3(nodes[i].translation[0],
                                          nodes[i].translation[1],
                                          nodes[i].translation[2]));
        if (nodes[i].rotation != undefined)
          rot = matr.rotateVec(new vec3(nodes[i].rotation[0],
                                        nodes[i].rotation[1],
                                        nodes[i].rotation[2]),
                                        nodes[i].rotation[3]);
                                                              
        if (nodes[i].scale != undefined)
          scale = matr.scale(new vec3(nodes[i].scale[0],
                                      nodes[i].scale[1],
                                      nodes[i].scale[2]),
                                      nodes[i].scale[3]);
        nodes[i].localM = (trans.mulMatr(rot)).mulMatr(scale);
        if (nodes[i].matrix != undefined)
          nodes[i].localM = nodes[i].localM.mulMatr.apply(null, nodes[i].matrix);                              
        if (i == 0)
          nodes[i].parentI = -1;
        if (nodes[i].children != undefined)
          for (let j = 0; j < nodes[i].children.length; j++)
            nodes[j].parentI = i;
      }
      
      /* Load matrices */
      for (let i = 0; i < nodes.length; i++)
        if (nodes[i].mesh != undefined) {  // problem: multiple meshes, primitives
          let prI = nodes[i].mesh;
          this.prims[prI].trans = nodes[i].localM;
          let parInd = this.prims[prI].parInd;
          while (parInd != undefined && parInd != -1) {
            this.prims[prI].trans = this.prims[prI].trans.mulMatr(nodes[parInd].localM);
            parInd = nodes[parInd].parInd;
          }
        } 
      return Result;
    }

    draw(gl){
      let i;
      for (i = 0; i < this.prims.length; i++)
        this.prims[i].draw();
    }
}