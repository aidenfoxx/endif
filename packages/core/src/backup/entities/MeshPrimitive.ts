import { DrawMode } from "../types";
import { generateID } from "../utils/generateID";
import { AABB, aabbCalculate } from "../utils/math";
import { DataBuffer } from "./buffer/DataBuffer";
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
  [BufferKey.POSITION]: DataBuffer;
  [BufferKey.NORMAL]?: DataBuffer;
  [BufferKey.TEXTCOORD_0]?: DataBuffer;
  [BufferKey.TEXTCOORD_1]?: DataBuffer;
  [BufferKey.TEXTCOORD_2]?: DataBuffer;
  [BufferKey.TEXTCOORD_3]?: DataBuffer;
  [BufferKey.INDEX]?: DataBuffer;
}

export class MeshPrimitive {
  private material?: Material;
  private mode: DrawMode = DrawMode.TRIANGLES;

  private obb: AABB;

  private cacheKey = generateID();

  constructor(private readonly buffers: MeshBuffers) {
    const positions = new Float32Array(
      buffers[BufferKey.POSITION].buffer,
      buffers[BufferKey.POSITION].byteOffest,
      buffers[BufferKey.POSITION].count
    );

    this.obb = aabbCalculate(Array.from(positions));
  }

  public getBuffer(key: BufferKey): DataBuffer | undefined {
    return this.buffers[key];
  }

  public getMaterial(): Material | undefined {
    return this.material;
  }

  public getMode(): DrawMode {
    return this.mode;
  }

  public getOBB(): AABB {
    return this.obb;
  }

  public getCacheKey(): number {
    return this.cacheKey;
  }

  public setMaterial(material?: Material): void {
    this.material = material;
    this.cacheKey = generateID();
  }

  public setMode(mode: DrawMode): void {
    this.mode = mode;
  }
}
