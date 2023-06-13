import {vec3, matr} from "../../mth/math.js"
import {shader} from "./resources/shader.js"
import {primitive} from "./resources/primitive.js"
import {model} from "./resources/model.js"
import {camera } from "../../mth/camera.js"

const canvas = document.getElementById("glCanvas")
//var gl;

export class render{
    constructor() {
        this.cam = new camera();
        this.shader = new shader();
        this.angleX = 0;
        this.angleY = 0;
    }

    initGL(canvas) {
        try {
            window.gl = canvas.getContext("webgl2");
            window.gl.viewportWidth = canvas.width;
            window.gl.viewportHeight = canvas.height;
        } catch (e) {
        }
        if (!window.gl) {
            alert("Could not initialise WebGL");
        }    
    }

    //updateUniforms() {
    //     if (this.matrWVPUniform != null) {
    //        window.gl.uniformMatrix4fv(this.matrWVPUniform, false, new Float32Array(this.cam.VP.Data)); 
    //    }
    //}

    drawScene() {
        window.gl.viewport(0, 0, window.gl.viewportWidth, window.gl.viewportHeight);
        window.gl.clear(window.gl.COLOR_BUFFER_BIT | window.gl.DEPTH_BUFFER_BIT);
        window.gl.enable(window.gl.DEPTH_TEST);

        //this.updateUniforms();

        this.Pr.draw();
        this.Pr2.draw();
        //this.Dog.draw();
        //this.Fig.draw();
    }

    tick() {
        window.requestAnimationFrame(()=>this.tick());
        this.drawScene();
    }

    moveCam(key)
    {
        let dTime = 0.6;
        let kd = 0, ka = 0, ke = 0, kq = 0, kw = 0, ks = 0;
        if (key == 68) // 'd' key code
          kd = 1;
        if (key == 65) // 'a' key code
          ka = 1;
        if (key == 69) // 'e' key code
          ke = 1;
        if (key == 81) // 'q' key code
          kq = 1;
        if (key == 87) // 'w' key code
          kw = 1;
        if (key == 83) // 's' key code
          ks = 1;

        let Move = new vec3(kd - ka, ke - kq, kw - ks);
        let NewLoc = this.cam.Loc;
        let WasChanged = false;
        
        if (Move.X != 0 || Move.Y != 0 || Move.Z != 0)
        {
          Move = Move.mulByNum(dTime/*!!*/);
          let tmpVec = this.cam.Dir.mulByNum(Move.Z).addVec(this.cam.Right.mulByNum(Move.X));
          Move = tmpVec.addVec(new vec3(0, 1, 0).mulByNum(Move.Y));
        
          NewLoc = NewLoc.addVec(Move);
          WasChanged = true;
        }

        const clamp = (num, min, max) => Math.min(Math.max(num, min), max);
        if (window.rot && (window.mdx != 0 || window.mdy != 0))
        {
          this.angleX = this.angleX + window.mdx * 0.0013;
          const threshold = 0.0001;
          this.angleY = clamp(this.angleY - window.mdy * 0.0013, -Math.PI / 2.0 + threshold, Math.PI / 2.0 - threshold);
          WasChanged = true;
        }
        
        if (WasChanged) {
          let newAt = NewLoc.subVec((new vec3(Math.sin(this.angleX) * Math.cos(this.angleY), Math.sin(this.angleY), Math.cos(this.angleX) * Math.cos(this.angleY))).mulByNum(2.0));
          this.cam.SetLocAtUp(NewLoc, newAt, this.cam.Up);
        }
    }

    createCubePrim() {
      let P = new Float32Array([1, 1, -1,
        1, 1, 1, 
        1, -1, 1,
        1, -1, -1, 
        -1, 1, 1, 
        -1, 1, -1, 
        -1, -1, -1, 
        -1, -1, 1,
        -1, 1, 1, 
        1, 1, 1, 
        1, 1, -1, 
        -1, 1, -1, 
        -1, -1, -1, 
        1, -1, -1, 
        1, -1, 1, 
        -1, -1, 1, 
        1, 1, 1, 
        -1, 1, 1, 
        -1, -1, 1,
        1, -1, 1, 
        -1, 1, -1, 
        1, 1, -1, 
        1, -1, -1, 
        -1, -1, -1]);
        
      let N = new Float32Array([1, 0, 0, 
         1, 0, 0, 
         1, 0, 0, 
         1, 0, 0, 
         -1, 0, 0, 
         -1, 0, 0, 
         -1, 0, 0, 
         -1, 0, 0, 
         0, 1, 0, 
         0, 1, 0, 
         0, 1, 0, 
         0, 1, 0, 
         0, -1, 0, 
         0, -1, 0, 
         0, -1, 0, 
         0, -1, 0, 
         0, 0, 1, 
         0, 0, 1, 
         0, 0, 1, 
         0, 0, 1, 
         0, 0, -1, 
         0, 0, -1, 
         0, 0, -1, 
         0, 0, -1]);

      let I = new Uint16Array([0, 1, 2, 0, 2, 3, 4, 5, 6, 4, 6, 7, 8, 9, 10, 8, 10, 11, 12, 13, 14, 12, 14, 15, 16, 17, 18, 16, 18, 19, 20, 21, 22, 20, 22, 23]);
      let res = new primitive();
      res.create(window.gl.TRIANGLES, P, P.length, N, I, I.length, "DEFAULT");
      return res;
    }

    createTetrPrim() {
      let c = Math.cos(Math.PI / 3.0), s = Math.sin(Math.PI / 3.0), tmp = Math.sqrt(1 - 1 / s / s / 4);
      let P = new Float32Array([
        -1, -1, 1,                 // bottom side
        1, -1, 1,            
        -1 + c, -1, 1 - s,
        -1, -1, 1,                 // front side
        1, -1, 1,
        -1 + c, tmp, 1 - s / 3.0,
        1, -1, 1,                  // right side
        -1 + c, -1, 1 - s,
        -1 + c, tmp, 1 - s / 3.0,
        -1 + c, -1, 1 - s,         // left side
        -1, -1, 1,
        -1 + c, tmp, 1 - s / 3.0,
      ]);
      let I = new Uint16Array([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]);
      let N = this.evalNormals(P, I);

      let res = new primitive();
      res.create(window.gl.TRIANGLES, P, P.length, N, I, I.length, "DEFAULT");
      return res;
    }

    evalNormals(P, I) {
      let V = [];
      for (let i = 0; i < P.length - 2; i += 3)
        V[i / 3] = new vec3(P[i], P[i + 1], P[i + 2]);
      let Norms = [];

      for (let i = 0; i < P.length / 3; i++)
        Norms[i] = new vec3(0, 0, 0);

      for (let i = 0; i < I.length - 2; i += 3) {
        let N = ((V[I[i + 1]].subVec(V[I[i]])).cross(V[I[i + 2]].subVec(V[I[i]]))).normalize();

        Norms[I[i + 0]] = (Norms[I[i + 0]].addVec(N)).normalize();
        Norms[I[i + 1]] = (Norms[I[i + 1]].addVec(N)).normalize();
        Norms[I[i + 2]] = (Norms[I[i + 2]].addVec(N)).normalize();
      }
      let res = new Float32Array(P.length);
      for (let i = 0; i < Norms.length; i++) {
        res[i * 3] = Norms[i].X;
        res[i * 3 + 1] = Norms[i].Y;
        res[i * 3 + 2] = Norms[i].Z;
      }
      return res;
    }

    startGL() {
        this.initGL(canvas);
        this.shader.create("DEFAULT").then(() => {
            this.shaderProgram = this.shader.shaderProgram;
            this.matrWVPUniform = window.gl.getUniformLocation(this.shaderProgram, "MatrWVP");
            gl.clearColor(0.0, 0.0, 0.0, 1.0);

            /*
            let P = new Float32Array([1.0, 1.0, 1.0,
                                      -1.0, 1.0, 1.0, 
                                      1.0, -1.0, 1.0,
                                      -1.0, -1.0, 0.0]);
            let I = new Uint16Array([2, 1, 0, 3, 1, 2]);
            */
           let P = new Float32Array([1, 1, -1,
                                     1, 1, 1, 
                                     1, -1, 1,
                                     1, -1, -1, 
                                     -1, 1, 1, 
                                     -1, 1, -1, 
                                     -1, -1, -1, 
                                     -1, -1, 1,
                                     -1, 1, 1, 
                                     1, 1, 1, 
                                     1, 1, -1, 
                                     -1, 1, -1, 
                                     -1, -1, -1, 
                                     1, -1, -1, 
                                     1, -1, 1, 
                                     -1, -1, 1, 
                                     1, 1, 1, 
                                     -1, 1, 1, 
                                     -1, -1, 1,
                                     1, -1, 1, 
                                     -1, 1, -1, 
                                     1, 1, -1, 
                                     1, -1, -1, 
                                     -1, -1, -1]);
                                     
            let N = new Float32Array([1, 0, 0, 
                                      1, 0, 0, 
                                      1, 0, 0, 
                                      1, 0, 0, 
                                      -1, 0, 0, 
                                      -1, 0, 0, 
                                      -1, 0, 0, 
                                      -1, 0, 0, 
                                      0, 1, 0, 
                                      0, 1, 0, 
                                      0, 1, 0, 
                                      0, 1, 0, 
                                      0, -1, 0, 
                                      0, -1, 0, 
                                      0, -1, 0, 
                                      0, -1, 0, 
                                      0, 0, 1, 
                                      0, 0, 1, 
                                      0, 0, 1, 
                                      0, 0, 1, 
                                      0, 0, -1, 
                                      0, 0, -1, 
                                      0, 0, -1, 
                                      0, 0, -1]);

            let I = new Uint16Array([0, 1, 2, 0, 2, 3, 4, 5, 6, 4, 6, 7, 8, 9, 10, 8, 10, 11, 12, 13, 14, 12, 14, 15, 16, 17, 18, 16, 18, 19, 20, 21, 22, 20, 22, 23]);
            this.Pr2 = new primitive();
            this.Pr2.create(window.gl.TRIANGLES, P, P.length, N, I, I.length, "DEFAULT");
            this.Pr2.trans = matr.scale(new vec3(0.6, 0.6, 0.6)).mulMatr(this.Pr2.trans.mulMatr(matr.translate(new vec3(3.0, 0.0, 1.0))));
            //this.Pr = this.createTetrPrim();
            this.Pr = new model();
            this.Pr.loadGLTF("sphere", "DEFAULT");
        
            this.drawScene();
            this.tick();
        });
    }
}