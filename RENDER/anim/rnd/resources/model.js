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
      if (accesInd < 0)
        return;
      let bufferView = data.bufferViews[data.accessors[accesInd].bufferView];

      let i, j;
      let shift = bufferView.byteOffset;
      if (shift == undefined)
        shift = 0;
      return new type(bin, shift, Math.floor(bufferView.byteLength / type.BYTES_PER_ELEMENT));
    }
    
    loadGLTF(name, shdName) {
      let jsondata = this.loadJSON("../../bin/models/" + name + "/" + name + ".gltf");
      let bindata = this.loadBIN("../../bin/models/" + name + "/" + name + ".bin");
      let data;
      let bin;

      jsondata.then((res) => {
        data = res;
      })
      bindata.then((res) => {
        bin = res;//new Uint8Array(res);
      })
  
      const Res = Promise.all([jsondata, bindata]);
      Res.then(() => {
        /* Check number of the model scenes */
        if (data.scenes.length > 1) {
          console.log("Problem: too much scenes!");
          return;
        }

        /* Load matricies */
        let flag = false;

        /* Load meshes */
        let i, j;
        for (i = 0; i < data.meshes.length; i++) {
          for (j = 0; j < data.meshes[i].primitives.length; j++) {
              let prim = new primitive();
              let attrib = data.meshes[i].primitives[j].attributes;

              /* Load mesh data arrays */
              let P = this.loadAttrib(data, bin, attrib.POSITION, Float32Array);
              let N = this.loadAttrib(data, bin, attrib.NORMAL, Float32Array);
              let I = this.loadAttrib(data, bin, data.meshes[i].primitives[j].indices, Uint16Array);

              let mode = window.gl.TRIANGLES;
              if (data.meshes[i].primitives[j].mode != undefined)
                mode = data.meshes[i].primitives[j].mode;
              prim.create(mode, P, P.length, N, I, I.length, shdName);
              this.prims.push(prim);

          }

        }       
      })
    }

    draw(gl){
      let i;
      for (i = 0; i < this.prims.length; i++)
        this.prims[i].draw();
    }
}