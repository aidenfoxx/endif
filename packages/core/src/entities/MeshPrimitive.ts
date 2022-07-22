import { DrawMode } from "../types";
import { AABB, aabbCalculate } from "../utils/math";
import { BufferView } from "./buffer/BufferView";
import { Material } from "./Material";

export enum BufferKey {
  POSITION,
  NORMAL,
  TEXTCOORD_0,
  TEXTCOORD_1,
  TEXTCOORD_2,
  TEXTCOORD_3,
  INDEX
}

export interface MeshBuffers {
  [BufferKey.POSITION]: BufferView;
  [BufferKey.NORMAL]?: BufferView;
  [BufferKey.TEXTCOORD_0]?: BufferView;
  [BufferKey.TEXTCOORD_1]?: BufferView;
  [BufferKey.TEXTCOORD_2]?: BufferView;
  [BufferKey.TEXTCOORD_3]?: BufferView;
  [BufferKey.INDEX]?: BufferView;
}

export class MeshPrimitive extends Observable {
  public mode: DrawMode = DrawMode.TRIANGLES;

  private aabb: AABB = [[0, 0, 0], [0, 0, 0]];
  private aabbStateID: number = -1;

  constructor(public readonly buffers: MeshBuffers, public material: Material) {
    super(); 

    this.buffers = { ...buffers };

    this.watch(this.buffers, BufferKey.POSITION);
    this.watch(this.buffers, BufferKey.NORMAL);
    this.watch(this.buffers, BufferKey.TEXTCOORD_0);
    this.watch(this.buffers, BufferKey.TEXTCOORD_1);
    this.watch(this.buffers, BufferKey.TEXTCOORD_2);
    this.watch(this.buffers, BufferKey.TEXTCOORD_3);
    this.watch(this.buffers, BufferKey.INDEX);
    this.watch(this, 'material');
  }

  public getAABB(): AABB {
    if (this.stateID !== this.aabbStateID) {
      const bufferView = this.buffers[BufferKey.POSITION];
      // TODO: This needs to support other data types
      const positionData = new Float32Array(
        bufferView.buffer,
        bufferView.byteOffest,
        bufferView.count
      )

      this.aabb = aabbCalculate(Array.from(positionData));
      this.aabbStateID = this.stateID;
    }

    return this.aabb;
  }
}