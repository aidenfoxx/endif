export interface Mesh {
  vertices: Array<number>;
  normals: Array<number>;
  uvs: Array<number>;
  indices: Array<number>;
}

export function meshInit(
  vertices: Array<number>,
  uvs: Array<number> = [],
  normals: Array<number> = [],
  indices: Array<number> = []
): Mesh {
  return {
    vertices: [...vertices],
    uvs: [...uvs],
    normals: [...normals],
    indices: [...indices],
  };
}
