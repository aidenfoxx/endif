export enum TextureFormat {
  RGB = WebGL2RenderingContext.RGB,
  RGBA = WebGL2RenderingContext.RGBA
}

export class Texture {
  private texture: ImageBitmap;

  private format: TextureFormat;

  private mipmaps: Array<ImageBitmap>;

  // Used by normal and occlusion textures
  public scale: Readonly<number>;

  private textureCache: Map<WebGL2RenderingContext, WebGLTexture> = new Map();

  constructor(
    texture: ImageBitmap,
    format: TextureFormat = TextureFormat.RGB,
    mipmaps: Array<ImageBitmap> = [],
    scale: number = 1,
  ) {
    this.texture = texture;
    this.format = format;
    this.mipmaps = [...mipmaps];
    this.scale = scale;
  }

  public bind(gl: WebGL2RenderingContext): void {
    let texture: WebGLTexture | null | undefined = this.textureCache.get(gl);
    
    if (texture) {
      gl.bindTexture(gl.TEXTURE_2D, texture);
      return;
    }

    texture = gl.createTexture();

    if (!texture) {
      throw new Error('Failed to create texture buffer');
    }
  
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, this.format, this.format, gl.UNSIGNED_BYTE, this.texture);

    for (let i = 0; i < this.mipmaps.length; i++) {
      gl.texImage2D(gl.TEXTURE_2D, i + 1, this.format, this.format, gl.UNSIGNED_BYTE, this.mipmaps[i]);
    }
  
    if (!this.mipmaps.length) {
      gl.generateMipmap(gl.TEXTURE_2D);
    }
  }
}
