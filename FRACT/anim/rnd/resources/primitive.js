import {vec2, vec3, vec4} from '../../../mth/math.js'
//import 'https://greggman.github.io/webgl-lint/webgl-lint.js';

export class vertex{
  constructor(pos, texCoord, normal, color) {
    this.P = pos;
    this.T = texCoord;
    this.N = notmal;
    this.C = color;
  }
};

export class primitive{
  constructor() {
    this.NumOfEl = 0;
    this.VA = null;
    this.VBuf = null;
    this.IBuf = null;
  }

  Create(gl, type, P, noofV, I, noofI, shaderProgram) {
    this.prType = type;

   if (P != null && noofV != 0) { 
      /* Shader attributes data */
      const positionLoc = gl.getAttribLocation(shaderProgram, 'in_pos');
      const normalLoc = gl.getAttribLocation(shaderProgram, 'in_normal');
  
      this.VA = gl.createVertexArray();
      gl.bindVertexArray(this.VA);
  
      /* Create vertices buffer */
      this.VBuf = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, this.VBuf);
      gl.bufferData(gl.ARRAY_BUFFER, P, gl.STATIC_DRAW);
      gl.enableVertexAttribArray(positionLoc); 
      gl.vertexAttribPointer(positionLoc, 3,
        gl.FLOAT, false,
        0, 0);
    }
    
    
    if (I != null && noofI != 0) {
      this.IBuf = gl.createBuffer();
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.IBuf);
      gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, I, gl.STATIC_DRAW);
      this.numOfEl = noofI;
    }
    else
      this.numOfEl = noofV;
    gl.bindVertexArray(null);
  }

  Draw(gl) {
    /* Making an array of vertices active */
    gl.bindVertexArray(this.VA);

    if (this.IBuf == null)
      gl.drawArrays(this.prType, 0, this.numOfEl);
    else {
      /* Making an array of indexes active */
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.IBuf);
      /* Drawing */
      gl.drawElements(this.prType, this.numOfEl, gl.UNSIGNED_SHORT, 0);
      /* Disable index array */
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
    }
    /* Disable vertex array */
    gl.bindVertexArray(null);
  }

  Free(gl) {
    if (VA != null) {
      gl.bindVertexArray(this.VA);
      gl.bindBuffer(gl.ARRAY_BUFFER, 0);
      gl.deleteBuffer(this.VBuf);
      gl.bindVertexArray(null);
      gl.deleteVertexArray(this.VA);
    }
    if (this.IBuf != null)
      gl.deleteBuffers(this.IBuf);
    this.VA = this.IBuf = null;
  }
}