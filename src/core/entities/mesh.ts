export interface Mesh {
  readonly vertices: number[],
  readonly normals: number[],
  readonly uvs: number[],
  readonly indices: number[],
}

export function meshInit(vertices: number[], uvs?: number[], normals?: number[], indices?: number[]): Mesh {
  return {
    vertices: [...vertices],
    uvs: uvs ? [...uvs] : [],
    normals: normals ? [...normals] : [],
    indices: indices ? [...indices] : []
  };
}
