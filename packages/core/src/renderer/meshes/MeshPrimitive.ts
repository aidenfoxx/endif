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

export class MeshPrimitive extends Observable {
  public mode: DrawMode = DrawMode.TRIANGLES;

  private aabb: AABB = [
    [0, 0, 0],
    [0, 0, 0],
  ];
  private aabbStateID: number = -1;

  constructor(public readonly buffers: MeshBuffers, public material: Material) {
    super();

    this.buffers = { ...buffers };

    this.watch(this.buffers, BufferKey.POSITION);
  }

  public getAABB(): AABB {
    if (this.stateID !== this.aabbStateID) {
      const bufferView = this.buffers[BufferKey.POSITION];
      // TODO: This needs to support other data types and stride
      const positionData = new Float32Array(
        bufferView.buffer.data,
        bufferView.buffer.byteOffest + bufferView.byteOffest,
        bufferView.count // TODO: This is relative to the data type (Int, Short etc)
      );

      this.aabb = aabbCalculate(Array.from(positionData));
      this.aabbStateID = this.stateID;
    }

    return this.aabb;
  }
}
