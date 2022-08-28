import { MagFilter, MinFilter, WrapMode } from '../../types';
import { createTexture } from '../../utils/gl/texture';
import { Context } from '../Context';

export class Texture {
  private gl: WebGL2RenderingContext;

  private texture?: WebGLTexture;

  constructor(
    public readonly image: ImageBitmap,
    public readonly texCoord: number = 0,
    public readonly minFilter: MinFilter = MinFilter.LINEAR_MIPMAP_LINEAR,
    public readonly magFilter: MagFilter = MagFilter.LINEAR,
    public readonly wrapS: WrapMode = WrapMode.REPEAT,
    public readonly wrapT: WrapMode = WrapMode.REPEAT
  ) {
    this.gl = Context.getContent();
  }

  public bind(): void {
    if (!this.texture) {
      const texture = createTexture(this.gl, this.image);

      this.gl.bindTexture(this.gl.TEXTURE_2D, texture);
      this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.minFilter);
      this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.magFilter);
      this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.wrapS);
      this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.wrapT);

      this.texture = texture;
    }

    this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture);
  }
}
