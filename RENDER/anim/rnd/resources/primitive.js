import {matr, vec3} from '../../../mth/math.js'
import {shader} from "./shader.js"
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
    this.trans = matr.rotateVec(new vec3(0, 0, 1), 60).mulMatr(matr.rotateVec(new vec3(0, 1, 0), 60));//matr.identity();
  }

  createPrim(type, P, noofV, N, I, noofI) {
    this.prType = type;
    if (P != null && noofV != 0) { 
      /* Shader attributes data */
      const positionLoc = gl.getAttribLocation(this.shd.shaderProgram, 'in_pos');
  
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
        const normalLoc = window.gl.getAttribLocation(this.shd.shaderProgram, 'in_normal');
        /* Create normals buffer */
        if (normalLoc >= 0) {
          this.NBuf = window.gl.createBuffer();
          window.gl.bindBuffer(window.gl.ARRAY_BUFFER, this .NBuf);
          window.gl.bufferData(window.gl.ARRAY_BUFFER, N, window.gl.STATIC_DRAW);
          window.gl.enableVertexAttribArray(normalLoc);
          window.gl.vertexAttribPointer(normalLoc, 3,
            window.gl.FLOAT, false,
            0, 0);
        }
        
      }
      gl.bindVertexArray(null);
    }   
    if (I != null && noofI != 0) {
      this.IBuf = window.gl.createBuffer();
      window.gl.bindBuffer(window.gl.ELEMENT_ARRAY_BUFFER, this.IBuf);
      window.gl.bufferData(window.gl.ELEMENT_ARRAY_BUFFER, I, window.gl.STATIC_DRAW);
      this.numOfEl = noofI;
    }
    else
      this.numOfEl = noofV;
  }

  async create(type, P, noofV, N, I, noofI, shdName) {
    this.shd = new shader();
    this.shd.create(shdName).then(()=> {
      this.matrWVPUniform = window.gl.getUniformLocation(this.shd.shaderProgram, "MatrWVP");
      this.createPrim(type, P, noofV, N, I, noofI);
    });
  }

  draw() {
    window.gl.useProgram(this.shd.shaderProgram);
    
    /* Update matricies */
    if (this.matrWVPUniform != undefined)
      window.gl.uniformMatrix4fv(this.matrWVPUniform, false, new Float32Array(this.trans.mulMatr(window.VP).Data)); 

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

  /*
  Free(gl) {
    if (VA != null) {
      window.gl.bindVertexArray(this.VA);
      window.gl.bindBuffer(gl.ARRAY_BUFFER, 0);
      window.gl.deleteBuffer(this.VBuf);
      window.gl.bindVertexArray(null);
      window.gl.deleteVertexArray(this.VA);
    }
    if (this.IBuf != null)
      window.gl.deleteBuffers(this.IBuf);
    this.VA = this.IBuf = null;
  }
  */
}