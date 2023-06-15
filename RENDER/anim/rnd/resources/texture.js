export class texture {
    isPowerOf2(value) {
        return (value & (value - 1)) === 0;
    }

    constructor() {
    }

    load(url) {
        this.GLtype = window.gl.TEXTURE_2D;
        this.GLtexture = window.gl.createTexture();
        window.gl.bindTexture(window.gl.TEXTURE_2D, this.GLtexture);
      
        const level = 0;
        const internalFormat = window.gl.RGBA;
        const width = 1;
        const height = 1;
        const border = 0;
        const srcFormat = window.gl.RGBA;
        const srcType = window.gl.UNSIGNED_BYTE;
        const pixel = new Uint8Array([0, 255, 0, 255]);
        window.gl.texImage2D(
          window.gl.TEXTURE_2D,
          level,
          internalFormat,
          width,
          height,
          border,
          srcFormat,
          srcType,
          pixel
        );
      
        const image = new Image();
        image.onload = () => {
          window.gl.bindTexture(gl.TEXTURE_2D, this.GLtexture);
          window.gl.texImage2D(
            gl.TEXTURE_2D,
            level,
            internalFormat,
            srcFormat,
            srcType,
            image
          );
      
          if (this.isPowerOf2(image.width) && this.isPowerOf2(image.height)) {
            window.gl.generateMipmap(window.gl.TEXTURE_2D);
          } 
          else {
            window.gl.texParameteri(window.gl.TEXTURE_2D, window.gl.TEXTURE_WRAP_S, window.gl.CLAMP_TO_EDGE);
            window.gl.texParameteri(window.gl.TEXTURE_2D, window.gl.TEXTURE_WRAP_T, window.gl.CLAMP_TO_EDGE);
            window.gl.texParameteri(window.gl.TEXTURE_2D, window.gl.TEXTURE_MIN_FILTER, window.gl.LINEAR);
          }
        };
        image.src = url;
      } 
    
}