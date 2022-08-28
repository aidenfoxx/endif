import { DrawMode } from '../../types';
import { createVertexArray } from '../../utils/gl/buffer';
import { AABB, aabbCalculate } from '../../utils/math';
import { BufferView } from '../buffers/BufferView';
import { Context } from '../Context';
import { Material } from '../materials/Material';

export enum BufferKey {
  POSITION,
  NORMAL,
  TANGENT,
  TEXCOORD_0,
  TEXCOORD_1,
  TEXCOORD_2,
  TEXCOORD_3,
  INDEX,
}

// TODO: Potentially add tangent and color buffers
export interface MeshBuffers {
  [BufferKey.POSITION]: BufferView;
  [BufferKey.NORMAL]?: BufferView;
  [BufferKey.TANGENT]?: BufferView;
  [BufferKey.TEXCOORD_0]?: BufferView;
  [BufferKey.TEXCOORD_1]?: BufferView;
  [BufferKey.TEXCOORD_2]?: BufferView;
  [BufferKey.TEXCOORD_3]?: BufferView;
  [BufferKey.INDEX]?: BufferView;
}

export class MeshPrimitive {
  public readonly mode: DrawMode = DrawMode.TRIANGLES;

  public readonly buffers: Readonly<MeshBuffers>;
  
  public readonly aabb: AABB;

  private gl: WebGL2RenderingContext;

  private vertexArray?: WebGLBuffer;

  constructor(buffers: MeshBuffers, public material: Material) {
    this.buffers = { ...buffers };
    
    const bufferView = this.buffers[BufferKey.POSITION];
    const positionData = new Float32Array( // TODO: This needs to support other data types and stride
      bufferView.buffer.data,
      bufferView.buffer.byteOffest + bufferView.byteOffest,
      bufferView.count // TODO: This is relative to the data type (Int, Short etc)
    );

    this.aabb = aabbCalculate(Array.from(positionData));
    this.gl = Context.getContent();
  }

  public setMode(mode: DrawMode): void {
    (this.mode as DrawMode) = mode;
  }

  public bind(): void {
    if (!this.vertexArray) {
      const vertexArray = createVertexArray(this.gl);

      this.gl.bindVertexArray(vertexArray);

      // Bind buffers
      const bufferKeys = Object.values(BufferKey).map(Number).filter(isFinite);

      for (const key of bufferKeys) {
        const bufferView = this.buffers[key as BufferKey];

        if (!bufferView) {
          this.gl.disableVertexAttribArray(key);
          continue;
        }

        bufferView.buffer.bind();

        if (key !== BufferKey.INDEX) {
          this.gl.enableVertexAttribArray(key);
          this.gl.vertexAttribPointer(
            key,
            bufferView.size,
            bufferView.type,
            bufferView.normalized,
            bufferView.byteStride,
            bufferView.byteOffest
          );
        }
      }

      this.vertexArray = vertexArray;
    }

    this.gl.bindVertexArray(this.vertexArray);
  }
}
