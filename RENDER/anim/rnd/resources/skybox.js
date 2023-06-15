import {primitive} from "./primitive.js";

export class skybox {
    constructor() {
    }

    isPowerOf2(value) {
        return (value & (value - 1)) === 0;
    }

    createTex(dirName, EXT) {
        let dir = "./bin/images/skyboxes/" + dirName + "/";
        this.GLtexture = window.gl.createTexture();
        this.GLtype = window.gl.TEXTURE_CUBE_MAP;
        window.gl.bindTexture(window.gl.TEXTURE_CUBE_MAP, this.GLtexture);

        const faceInfos = [
            { target: window.gl.TEXTURE_CUBE_MAP_POSITIVE_X, fname: dir + 'PosX.' + EXT},
            { target: window.gl.TEXTURE_CUBE_MAP_NEGATIVE_X, fname: dir + 'NegX.' + EXT},
            { target: window.gl.TEXTURE_CUBE_MAP_POSITIVE_Y, fname: dir + 'PosY.' + EXT},
            { target: window.gl.TEXTURE_CUBE_MAP_NEGATIVE_Y, fname: dir + 'NegY.' + EXT},
            { target: window.gl.TEXTURE_CUBE_MAP_POSITIVE_Z, fname: dir + 'PosZ.' + EXT},
            { target: window.gl.TEXTURE_CUBE_MAP_NEGATIVE_Z, fname: dir + 'NegZ.' + EXT},
          ];

          const level = 0;
          const internalFormat = window.gl.RGBA;
          const width = 1;
          const height = 1;
          const border = 0;
          const srcFormat = window.gl.RGBA;
          const srcType = window.gl.UNSIGNED_BYTE;
          const pixel = new Uint8Array([0, 0, 0, 255]);
          faceInfos.forEach((faceInfo) => {
              window.gl.texImage2D(
                faceInfo.target,
                level,
                internalFormat,
                width,
                height,
                border,
                srcFormat,
                srcType,
                pixel
              );
        });
      
        let images = [new Image(), new Image(), new Image(), new Image(), new Image(), new Image()];
        images.forEach((image, index) => {
            image.onload = () => {
                window.gl.texImage2D(
                    faceInfos[index].target,
                    level,
                    internalFormat,
                    srcFormat,
                    srcType,
                    image
                  );    
                  if (this.isPowerOf2(image.width) && this.isPowerOf2(image.height)) {
                      window.gl.generateMipmap(window.gl.TEXTURE_CUBE_MAP);
                    } 
                    else {
                        window.gl.texParameteri(window.gl.TEXTURE_CUBE_MAP, window.gl.TEXTURE_MAG_FILTER, window.gl.LINEAR);
                        window.gl.texParameteri(window.gl.TEXTURE_CUBE_MAP, window.gl.TEXTURE_MIN_FILTER, window.gl.LINEAR);
                        window.gl.texParameteri(window.gl.TEXTURE_CUBE_MAP, window.gl.TEXTURE_WRAP_S, window.gl.CLAMP_TO_EDGE);
                        window.gl.texParameteri(window.gl.TEXTURE_CUBE_MAP, window.gl.TEXTURE_WRAP_T, window.gl.CLAMP_TO_EDGE);
                    }
            };
            image.src = faceInfos[index].fname;
        });
    }

    async create(dirName, EXT) {
        this.prim = new primitive();
        let Z = 1.0 - (1.0 / (1 << 16));
        let skP = new Float32Array([-1, -1, Z,
                                    1, -1, Z,
                                    -1, 1, Z,
                                    1, 1, Z]);
        let skI = new Uint16Array([0, 1, 2, 2, 1, 3]);
        let res = await this.prim.create(window.gl.TRIANGLES, skP, null, null, skI, "SKYBOX");
        this.createTex(dirName, EXT);
        return res;
    }

    draw() {
        this.prim.mtl.shd.apply();

        window.gl.activeTexture(window.gl.TEXTURE0);
        window.gl.bindTexture(window.gl.TEXTURE_CUBE_MAP, this.GLtexture);
        this.prim.mtl.uniSet("Texture0", 0);

        this.prim.mtl.uniSet("InvProj", window.Proj.inverse());
        this.prim.mtl.uniSet("InvView", window.View.inverse());

        this.prim.draw();
    }
}