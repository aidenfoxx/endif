export interface Mesh {
  readonly vertices: ReadonlyArray<number>;
  readonly normals: ReadonlyArray<number>;
  readonly uvs: ReadonlyArray<number>;
  readonly indices: ReadonlyArray<number>;
}

export function meshInit(
  vertices: ReadonlyArray<number>,
  uvs: ReadonlyArray<number> = [],
  normals: ReadonlyArray<number> = [],
  indices: ReadonlyArray<number> = []
): Mesh {
  return {
    vertices: [...vertices],
    uvs: [...uvs],
    normals: [...normals],
    indices: [...indices]
  };
}
