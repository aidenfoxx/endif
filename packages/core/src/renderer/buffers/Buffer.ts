import { BufferType } from '../../types';
import { createArrayBuffer } from '../../utils/gl/buffer';
import { Context } from '../Context';

export class Buffer {
  private gl: WebGL2RenderingContext;

  private buffer?: WebGLBuffer;

  constructor(
    public readonly data: ArrayBuffer,
    public readonly byteLength: number,
    public readonly byteOffest: number = 0,
    public readonly target = BufferType.ARRAY_BUFFER
  ) {
    this.gl = Context.getContent();
  }

  public bind(): void {
    if (!this.buffer) {
      this.buffer = createArrayBuffer(
        this.gl,
        this.data,
        this.target,
        this.byteLength,
        this.byteOffest
      );
    }

    this.gl.bindBuffer(this.target, this.buffer);
  }
}
