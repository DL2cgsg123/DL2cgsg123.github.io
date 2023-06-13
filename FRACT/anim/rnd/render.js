//import * as mat4 from "./glMatrix-0.9.5.min.js"
import {primitive, vertex} from "./resources/primitive.js";

const canvas = document.getElementById("glCanvas")
var gl;

export class render{
    constructor() {
    }

    initGL(canvas) {
        try {
            gl = canvas.getContext("webgl2");
            gl.viewportWidth = canvas.width;
            gl.viewportHeight = canvas.height;
        } catch (e) {
        }
        if (!gl) {
            alert("Could not initialise WebGL");
        }    
    }

    async loadShader(shaderURL) {
        try {
            const responce = await fetch(shaderURL);
            const text = await responce.text();
            return text;
        } catch(err) {
            console.error(err);
        }
    }    
    
    createShader(type, text) {
        const shader = gl.createShader(type);
    
        gl.shaderSource(shader, text);
        gl.compileShader(shader);

        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            console.error("Error in shader: " + gl.getShaderInfoLog(shader));
            return null;
        }
        return shader;
    }    

    async initShaders() {
        let vs, fs;
        let vtext, ftext;
        vs = this.loadShader("./bin/shaders/vert.glsl");
        vs.then((text) => {
            vtext = text;
        })
        fs = this.loadShader("./bin/shaders/frag.glsl");
        fs.then((text) => {
            ftext = text;
        })
        const Data = Promise.all([vs, fs]);
        Data.then((res) => {
            const vertexShader = this.createShader(gl.VERTEX_SHADER, vtext);
            const fragmentShader = this.createShader(gl.FRAGMENT_SHADER, ftext);
            this.shaderProgram = gl.createProgram();
            gl.attachShader(this.shaderProgram, vertexShader);
            gl.attachShader(this.shaderProgram, fragmentShader);
            gl.linkProgram(this.shaderProgram);
    
            if (!gl.getProgramParameter(this.shaderProgram, gl.LINK_STATUS)) {
                alert("Could not initialize shaders");
            }
            this.timeUniform = gl.getUniformLocation(this.shaderProgram, "Time");
            this.widthUniform = gl.getUniformLocation(this.shaderProgram, "Width");
            this.heightUniform = gl.getUniformLocation(this.shaderProgram, "Height");
            this.transXUniform = gl.getUniformLocation(this.shaderProgram, "TransX");
            this.transYUniform = gl.getUniformLocation(this.shaderProgram, "TransY");
            this.scaleUniform = gl.getUniformLocation(this.shaderProgram, "Scale");
            this.mouseXUniform = gl.getUniformLocation(this.shaderProgram, "MouseX");
            this.mouseYUniform = gl.getUniformLocation(this.shaderProgram, "MouseY");
        });
        return Data;
    }

    drawScene() {
        gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        gl.useProgram(this.shaderProgram);
        if (this.timeUniform != null) {
            let date = new Date;
            let val = date.getSeconds();
            gl.uniform1f(this.timeUniform, val);
        }
        if (this.widthUniform != null) {
            gl.uniform1f(this.widthUniform, canvas.width);
        }
        if (this.heightUniform != null) {
            gl.uniform1f(this.heightUniform, canvas.height);
        }
        if (this.transXUniform != null) {
            gl.uniform1f(this.transXUniform, window.translate_x);
        }
        if (this.transYUniform != null) {
            gl.uniform1f(this.transYUniform, window.translate_y);
        }
        if (this.scaleUniform != null) {
            gl.uniform1f(this.scaleUniform, window.scale);
        }
        if (this.mouseXUniform != null && window.mouseX != undefined) {
            gl.uniform1f(this.mouseXUniform, window.mouseX);
        }
        if (this.mouseYUniform != null && window.mouseY != undefined) {
            gl.uniform1f(this.scaleUniform, window.mouseY);
        }

        this.Pr.Draw(gl);
    }

    tick() {
        window.requestAnimationFrame(()=>this.tick());
        this.drawScene();
    }

    startGL() {
        this.initGL(canvas);
        this.initShaders().then(() => {
            gl.clearColor(0.0, 0.0, 0.0, 1.0);

            let P = new Float32Array([1.0, 1.0, 0.0,
                                      -1.0, 1.0, 0.0, 
                                      1.0, -1.0, 0.0,
                                      -1.0, -1.0, 0.0]);
            let I = new Uint16Array([2, 1, 0, 3, 1, 2]);
            this.Pr = new primitive();
            this.Pr.Create(gl, gl.TRIANGLES, P, P.length, I, I.length, this.shaderProgram);
            
            this.drawScene();
            this.tick();
        });
    }
}