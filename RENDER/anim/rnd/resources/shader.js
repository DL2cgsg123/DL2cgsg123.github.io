export class shader {
    constructor() {
    }

    async loadText(shaderURL) {
        try {
            const responce = await fetch(shaderURL);
            const text = await responce.text();
            return text;
        } catch(err) {
            console.error(err);
        }
    }    
    
    createSingleShader(type, text) {
        const shader = gl.createShader(type);
    
        gl.shaderSource(shader, text);
        gl.compileShader(shader);

        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            console.error("Error in shader: " + gl.getShaderInfoLog(shader));
            return null;
        }
        return shader;
    }    

    dummy() {
        return true;
    }

    async create(shdName) {
        /* Check same shader existance */
        let i;
        for (i = 0; i < window.shaders.length; i++)
            if ((window.shaders[i] instanceof shader) && window.shaders[i].name == shdName) {
                this.shaderProgram = window.shaders[i].shaderProgram;
                this.name = shdName;
                let dummy = await this.dummy();
                return dummy;
            }
        /* Load shaders text */    
        let vtext, ftext;
        vtext = await this.loadText("./bin/shaders/" + shdName + "/vert.glsl");
        ftext = await this.loadText("./bin/shaders/" + shdName + "/frag.glsl");
        /* Create shader program */
        const vertexShader = this.createSingleShader(gl.VERTEX_SHADER, vtext);
        const fragmentShader = this.createSingleShader(gl.FRAGMENT_SHADER, ftext);
        this.shaderProgram = gl.createProgram();
        gl.attachShader(this.shaderProgram, vertexShader);
        gl.attachShader(this.shaderProgram, fragmentShader);
        gl.linkProgram(this.shaderProgram);
    
        if (!gl.getProgramParameter(this.shaderProgram, gl.LINK_STATUS)) {
            alert("Could not initialize shaders");
        }
        this.name = shdName;
        window.shaders.push(this);
        return ftext;
    }

    apply() {
        if (this.shaderProgram == undefined)
            return;
        window.gl.useProgram(this.shaderProgram);
    }
}