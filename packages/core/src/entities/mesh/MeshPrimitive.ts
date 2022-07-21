import { DrawMode } from "../../types";
import { BufferView } from "../buffer/BufferView";
import { Material } from "../Material";

export class MeshPrimitive {
  public mode: DrawMode = DrawMode.TRIANGLES;

  constructor(
    public readonly material: Material, // TODO: Should we be allowed to change material?
    public readonly positions: BufferView,
    public readonly normals?: BufferView,
    public readonly texCoords0?: BufferView,
    public readonly texCoords1?: BufferView,
    public readonly texCoords2?: BufferView,
    public readonly texCoords3?: BufferView,
    public readonly indices?: ArrayBuffer
  ) {}
}
