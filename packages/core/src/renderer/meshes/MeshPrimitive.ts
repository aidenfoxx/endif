import { Observable } from '../../reactor/Observable';
import { DrawMode } from '../../types';
import { AABB, aabbCalculate } from '../../utils/math';
import { BufferView } from '../buffers/BufferView';
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

  constructor(buffers: MeshBuffers, public material: Material) {
    this.buffers = { ...buffers };
    
    const bufferView = this.buffers[BufferKey.POSITION];
    const positionData = new Float32Array( // TODO: This needs to support other data types and stride
      bufferView.buffer.data,
      bufferView.buffer.byteOffest + bufferView.byteOffest,
      bufferView.count // TODO: This is relative to the data type (Int, Short etc)
    );

    this.aabb = aabbCalculate(Array.from(positionData));
  }

  public setMode(mode: DrawMode): void {
    (this.mode as DrawMode) = mode;
  }
}
