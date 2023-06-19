import {vec3, matr} from "../../mth/math.js"
import {shader} from "./resources/shader.js"
import {primitive} from "./resources/primitive.js"
import {model} from "./resources/model.js"
import {camera} from "../../mth/camera.js"
import {texture} from "./resources/texture.js"
import {skybox} from "./resources/skybox.js"

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

    drawScene() {
        window.gl.viewport(0, 0, window.gl.viewportWidth, window.gl.viewportHeight);
        window.gl.clear(window.gl.COLOR_BUFFER_BIT | window.gl.DEPTH_BUFFER_BIT);
        window.gl.enable(window.gl.DEPTH_TEST);

        this.skyBox.draw();
        /* Pass skybox texture for reflection */
        /*
        this.Pr.prims.forEach((prim, index) => {
          prim.mtl.shd.apply();
          window.gl.activeTexture(window.gl.TEXTURE1);
          window.gl.bindTexture(window.gl.TEXTURE_CUBE_MAP, this.skyBox.texture);
          prim.mtl.uniSet("Texture1", 1);
        })
        */
        this.Pr.draw();
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

    startGL() {
        this.initGL(canvas);
        gl.clearColor(0.0, 0.0, 0.0, 1.0);

        this.Pr = new model();
        let Prom1 = this.Pr.loadGLTF("figures", "DEFAULT");

        let tex = new texture();
        tex.load("./bin/images/DS2.png");

        this.skyBox = new skybox();
        let Prom2 = this.skyBox.create("IceMountains", "png");
        
        let Prom = Promise.all([Prom1, Prom2]);
        Prom.then(() => {
          this.Pr.prims[1].mtl.textures.push(tex);
          this.Pr.prims[1].mtl.textures.push(this.skyBox);
          this.Pr.prims[1].trans = matr.scale(new vec3(3.0, 3.0, 3.0)).mulMatr(matr.rotateVec(new vec3(0.0, 0.0, 1.0), 30.0)).mulMatr(matr.translate(new vec3(-4.0, 0.0, -20.0)));
          this.Pr.prims[0].mtl.textures.push(tex);
          this.Pr.prims[0].mtl.textures.push(this.skyBox);
          this.Pr.prims[0].trans = matr.scale(new vec3(2.0, 2.0, 2.0)).mulMatr(matr.translate(new vec3(2.0, 1.0, -12.0)));
          //this.cam.SetLocAtUp(new vec3(-20.12, -3.32, -22.49), new vec3(-18.71, -2.97, -21.11), new vec3(0.0, 1.0, 0.0));
          this.drawScene();
          this.tick();
        });
    }
}