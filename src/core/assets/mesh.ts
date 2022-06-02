interface Mesh {
  vertices: readonly number[],
  normals: readonly number[],
  uvs: readonly number[],
  indices: readonly number[],
}

export function initMesh(mesh: Mesh): Mesh;
export function initMesh(vertices: number[], normals?: number[], uvs?: number[], indices?: number[]): Mesh;
export function initMesh(vertices: Mesh | number[], normals?: number[], uvs?: number[], indices?: number[]): Mesh {
  if (vertices instanceof Array) {
    return {
      vertices: [...vertices],
      normals: normals ? [...normals] : [],
      uvs: uvs ? [...uvs] : [],
      indices: indices ? [...indices] : []
    };
  } else {
    return {
      vertices: [...vertices.vertices],
      normals: [...vertices.normals],
      uvs: [...vertices.uvs],
      indices: [...vertices.indices]
    };
  }
}

export default Mesh;
