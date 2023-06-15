import {matr, vec3} from '../../../mth/math.js'
import {material} from './material.js';
//import 'https://greggman.github.io/webgl-lint/webgl-lint.js';

export class vertex{
  constructor(pos, texCoord, normal, color) {
    this.P = pos;
    this.T = texCoord;
    this.N = notmal;
    this.C = color;
  }
};

export class primitive {
  constructor() {
    this.numOfEl = 0;
    this.VA = null;
    this.VBuf = null;
    this.NBuf = null;
    this.IBuf = null;
    this.trans = matr.identity();
    this.mtl = new material();
  }

  createPrim(type, P, T, N, I) {
    this.prType = type;
    if (P != null && P.length != 0) { 
      /* Shader attributes data */
      const positionLoc = gl.getAttribLocation(this.mtl.shd.shaderProgram, 'in_pos');
  
      this.VA = gl.createVertexArray();
      window.gl.bindVertexArray(this.VA);
  
      /* Create vertices buffer */
      if (positionLoc >= 0) {
        this.VBuf = gl.createBuffer();
        window.gl.bindBuffer(window.gl.ARRAY_BUFFER, this.VBuf);
        window.gl.bufferData(window.gl.ARRAY_BUFFER, P, window.gl.STATIC_DRAW);
        window.gl.enableVertexAttribArray(positionLoc); 
        window.gl.vertexAttribPointer(positionLoc, 3,
                               gl.FLOAT, false,
                               0, 0);
      }
                             
      if (N != null) {
        /* Shader attributes data */
        const normalLoc = window.gl.getAttribLocation(this.mtl.shd.shaderProgram, 'in_normal');
        /* Create normals buffer */
        if (normalLoc >= 0) {
          this.NBuf = window.gl.createBuffer();
          window.gl.bindBuffer(window.gl.ARRAY_BUFFER, this.NBuf);
          window.gl.bufferData(window.gl.ARRAY_BUFFER, N, window.gl.STATIC_DRAW);
          window.gl.enableVertexAttribArray(normalLoc);
          window.gl.vertexAttribPointer(normalLoc, 3,
            window.gl.FLOAT, false,
            0, 0);
        }
        
      }
      if (T != null) {
        /* Shader attributes data */
        const texcoordLoc = window.gl.getAttribLocation(this.mtl.shd.shaderProgram, 'in_texcoord');
        /* Create normals buffer */
        if (texcoordLoc >= 0) {
          this.TBuf = window.gl.createBuffer();
          window.gl.bindBuffer(window.gl.ARRAY_BUFFER, this.TBuf);
          window.gl.bufferData(window.gl.ARRAY_BUFFER, T, window.gl.STATIC_DRAW);
          window.gl.enableVertexAttribArray(texcoordLoc);
          window.gl.vertexAttribPointer(texcoordLoc, 2,
            window.gl.FLOAT, false,
            0, 0);
        }
        
      }
      gl.bindVertexArray(null);
    }   
    if (I != null && I.length != 0) {
      this.IBuf = window.gl.createBuffer();
      window.gl.bindBuffer(window.gl.ELEMENT_ARRAY_BUFFER, this.IBuf);
      window.gl.bufferData(window.gl.ELEMENT_ARRAY_BUFFER, I, window.gl.STATIC_DRAW);
      this.numOfEl = I.length;
    }
    else
      this.numOfEl = V == null ? 0 : V.length;
  }

  async create(type, P, T, N, I, shdName) {
      let tmp = await this.mtl.create(shdName);
      this.createPrim(type, P, T, N, I);
      return tmp;
  }

  createPrimFromBuffer(type, PAttr, NAttr, IAttr, Count, Buf) {
    this.prType = type;
    if (Buf != null && PAttr.byteLength > 0 && NAttr.byteLength > 0) { 
      /* Shader attributes data */
      const positionLoc = gl.getAttribLocation(this.shd.shaderProgram, 'in_pos');
      const normalLoc = gl.getAttribLocation(this.shd.shaderProgram, 'in_normal');

      if (positionLoc < 0 || normalLoc < 0)
        return; // !!!
      
      this.VA = gl.createVertexArray();
      window.gl.bindVertexArray(this.VA);
      
      this.VBuf = gl.createBuffer();
      window.gl.bindBuffer(window.gl.ARRAY_BUFFER, this.VBuf);
      let length = Count * 2;// * Float32Array.BYTES_PER_ELEMENT;//2 * 3 * Math.floor(PAttr.byteLength / Float32Array.BYTES_PER_ELEMENT);
      window.gl.bufferData(window.gl.ARRAY_BUFFER, new Float32Array(Buf, PAttr.byteOffset, length), window.gl.STATIC_DRAW);
      //window.gl.bufferData(window.gl.ARRAY_BUFFER, new Float32Array(Buf), window.gl.STATIC_DRAW);
      
      window.gl.enableVertexAttribArray(normalLoc);
      window.gl.vertexAttribPointer(normalLoc, 3,
        window.gl.FLOAT, false,
        NAttr.byteStride, 0);//NAttr.byteOffset + Math.floor(NAttr.byteStride / 2.0));

      window.gl.enableVertexAttribArray(positionLoc); 
      window.gl.vertexAttribPointer(positionLoc, 3,
        gl.FLOAT, false,
        PAttr.byteStride, Math.floor(NAttr.byteStride));
      
      gl.bindVertexArray(null);
    }
    if (Buf != null && IAttr.byteLength != 0) {
      this.IBuf = window.gl.createBuffer();
      window.gl.bindBuffer(window.gl.ELEMENT_ARRAY_BUFFER, this.IBuf);
      let Ind = new Uint32Array(Buf, IAttr.byteOffset, Math.floor(IAttr.byteLength / Uint32Array.BYTES_PER_ELEMENT));
      window.gl.bufferData(window.gl.ELEMENT_ARRAY_BUFFER, Ind, window.gl.STATIC_DRAW);
      this.numOfEl = Ind.length;
    }
    else
      this.numOfEl = Math.floor(PAttr.byteLength / Float32Array.BYTES_PER_ELEMENT / 3.0);
  }

  async createFromBuffer(type, PAttr, NAttr, IAttr, Count, Buf, shdName) {
    this.shd = new shader();
    this.shd.create(shdName).then(()=> {
      this.matrWVPUniform = window.gl.getUniformLocation(this.shd.shaderProgram, "MatrWVP");
      this.createPrimFromBuffer(type, PAttr, NAttr, IAttr, Count, Buf);
    });
  }

  draw() {    
    this.mtl.apply();
    this.mtl.uniSet("MatrWVP", this.trans.mulMatr(window.VP));
    /* Making an array of vertices active */
    window.gl.bindVertexArray(this.VA);

    if (this.IBuf == null)
      window.gl.drawArrays(this.prType, 0, this.numOfEl);
    else {
      /* Making an array of indexes active */
      window.gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.IBuf);
      /* Drawing */
      window.gl.drawElements(this.prType, this.numOfEl, window.gl.UNSIGNED_SHORT, 0);
      /* Disable index array */
      window.gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
    }
    /* Disable vertex array */
    window.gl.bindVertexArray(null);
  }
}