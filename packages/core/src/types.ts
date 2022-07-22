export enum BufferType {
  ARRAY_BUFFER = WebGL2RenderingContext.ARRAY_BUFFER,
  ELEMENT_ARRAY_BUFFER = WebGL2RenderingContext.ELEMENT_ARRAY_BUFFER,
}

export enum DataType {
  BYTE = WebGL2RenderingContext.BYTE,
  UNSIGNED_BYTE = WebGL2RenderingContext.UNSIGNED_BYTE,
  SHORT = WebGL2RenderingContext.SHORT,
  UNSIGNED_SHORT = WebGL2RenderingContext.UNSIGNED_SHORT,
  UNSIGNED_INT = WebGL2RenderingContext.UNSIGNED_INT,
  FLOAT = WebGL2RenderingContext.FLOAT,
}

export enum DrawMode {
  POINTS = WebGL2RenderingContext.POINTS,
  LINES = WebGL2RenderingContext.LINES,
  LINE_LOOP = WebGL2RenderingContext.LINE_LOOP,
  LINE_STRIP = WebGL2RenderingContext.LINE_STRIP,
  TRIANGLES = WebGL2RenderingContext.TRIANGLES,
  TRIANGLE_STRIP = WebGL2RenderingContext.TRIANGLE_STRIP,
  TRIANGLE_FAN = WebGL2RenderingContext.TRIANGLE_FAN,
}

export enum MinFilter {
  NEAREST = WebGL2RenderingContext.NEAREST,
  LINEAR = WebGL2RenderingContext.LINEAR,
  NEAREST_MIPMAP_NEAREST = WebGL2RenderingContext.NEAREST_MIPMAP_NEAREST,
  LINEAR_MIPMAP_NEAREST = WebGL2RenderingContext.LINEAR_MIPMAP_NEAREST,
  NEAREST_MIPMAP_LINEAR = WebGL2RenderingContext.NEAREST_MIPMAP_LINEAR,
  LINEAR_MIPMAP_LINEAR = WebGL2RenderingContext.LINEAR_MIPMAP_LINEAR,
}

export enum MagFilter {
  NEAREST = WebGL2RenderingContext.NEAREST,
  LINEAR = WebGL2RenderingContext.LINEAR,
}

export enum WrapMode {
  CLAMP_TO_EDGE = WebGL2RenderingContext.CLAMP_TO_EDGE,
  MIRRORED_REPEAT = WebGL2RenderingContext.MIRRORED_REPEAT,
  REPEAT = WebGL2RenderingContext.REPEAT,
}
