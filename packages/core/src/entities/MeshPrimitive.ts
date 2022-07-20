import { DataBuffer } from "./buffers/DataBuffer";
import { Material } from "./Material";

export enum DrawMode {
  POINTS = WebGL2RenderingContext.POINTS,
  LINES = WebGL2RenderingContext.LINES,
  LINE_LOOP = WebGL2RenderingContext.LINE_LOOP,
  LINE_STRIP = WebGL2RenderingContext.LINE_STRIP,
  TRIANGLES = WebGL2RenderingContext.TRIANGLES,
  TRIANGLE_STRIP = WebGL2RenderingContext.TRIANGLE_STRIP,
  TRIANGLE_FAN = WebGL2RenderingContext.TRIANGLE_FAN
}

export class MeshPrimitive {
  public mode: DrawMode = DrawMode.TRIANGLES

  constructor(
    public readonly positions?: DataBuffer,
    public readonly normals?: DataBuffer,
    public readonly texCoords0?: DataBuffer,
    public readonly texCoords1?: DataBuffer,
    public readonly texCoords2?: DataBuffer,
    public readonly texCoords3?: DataBuffer,
    public readonly indices?: Uint16Array,
    public readonly material?: Material
  ) {}
}
