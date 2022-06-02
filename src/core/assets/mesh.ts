interface Mesh {
  vertices: readonly number[],
  normals: readonly number[],
  uvs: readonly number[],
  indices: readonly number[],
}

export function meshInit(mesh: Mesh): Mesh;
export function meshInit(vertices: number[], uvs?: number[], normals?: number[], indices?: number[]): Mesh;
export function meshInit(vertices: Mesh | number[], uvs?: number[], normals?: number[], indices?: number[]): Mesh {
  if (vertices instanceof Array) {
    return {
      vertices: [...vertices],
      uvs: uvs ? [...uvs] : [],
      normals: normals ? [...normals] : [],
      indices: indices ? [...indices] : []
    };
  } else {
    return {
      vertices: [...vertices.vertices],
      uvs: [...vertices.uvs],
      normals: [...vertices.normals],
      indices: [...vertices.indices]
    };
  }
}

export default Mesh;
