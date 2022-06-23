import { Mesh, meshInit } from '../../entities/mesh';
import { ObjParseException } from '../../expcetions';

const POINT_MATCH = /^(-?\d+)\/?(-?\d*)\/?(-?\d*)$/;

export function objParse(data: string): Mesh {
  const lines = data.split(/\r\n|\n/g);

  const vertices = [];
  const uvs = [];
  const normals = [];
  const points = [];

  // Parse obj
  for (let i = 0; i < lines.length; i++) {
    const [definition, ...values] = lines[i].trim().split(/ +/);

    if (!values.length) {
      continue;
    }

    switch (definition.toLowerCase()) {
      case 'v':
        vertices.push([Number(values[0]), Number(values[1]), Number(values[2])]);
        break;

      case 'vt':
        uvs.push([Number(values[0]), Number(values[1])]);
        break;

      case 'vn':
        normals.push([Number(values[0]), Number(values[1]), Number(values[2])]);
        break;

      case 'f':
        for (let p = 0; p < values.length; p++) {
          const match = values[p].match(POINT_MATCH);

          if (match) {
            points.push([Number(match[1]), Number(match[2]), Number(match[3])]);
          }
        }
        break;
    }
  }

  if (!points.length) {
    throw new ObjParseException('No faces defined');
  }

  // Index mesh
  const indexedVertices = [];
  const indexedUVs = [];
  const indexedNormals = [];
  const indices = [];

  const indexCache: Map<number, Map<number, Map<number, number>>> = new Map();

  for (let i = 0, index = 0; i < points.length; i++) {
    const point = points[i];

    // Returns -1 if index does not exist
    const vertexIndex = point[0] < 0 ? vertices.length + point[0] : point[0] - 1;
    const uvIndex = point[1] < 0 ? uvs.length + point[1] : point[1] - 1;
    const normalIndex = point[2] < 0 ? normals.length + point[2] : point[2] - 1;
    const pointIndex = indexCache.get(vertexIndex)?.get(uvIndex)?.get(normalIndex);

    if (pointIndex === undefined) {
      // Index point
      if (vertices[vertexIndex] === undefined) {
        throw new ObjParseException(`Vertex index out-of-bounds`);
      }

      const vertexOffset = index * 3;

      indexedVertices[vertexOffset] = vertices[vertexIndex][0];
      indexedVertices[vertexOffset + 1] = vertices[vertexIndex][1];
      indexedVertices[vertexOffset + 2] = vertices[vertexIndex][2];

      if (point[1]) {
        if (uvs[uvIndex] === undefined) {
          throw new ObjParseException('UV index out-of-bounds');
        }

        const uvOffset = index * 2;

        indexedUVs[uvOffset] = uvs[uvIndex][0];
        indexedUVs[uvOffset + 1] = uvs[uvIndex][1];
      }

      if (point[2]) {
        if (normals[normalIndex] === undefined) {
          throw new ObjParseException('Normal index out-of-bounds');
        }

        const normalOffset = index * 3;

        indexedNormals[normalOffset] = normals[normalIndex][0];
        indexedNormals[normalOffset + 1] = normals[normalIndex][1];
        indexedNormals[normalOffset + 2] = normals[normalIndex][2];
      }

      // Cached indexed point
      if (!indexCache.get(vertexIndex)) {
        indexCache.set(vertexIndex, new Map());
      }

      if (!indexCache.get(vertexIndex)!.get(uvIndex)) {
        indexCache.get(vertexIndex)!.set(uvIndex, new Map());
      }

      indices[i] = index;
      indexCache.get(vertexIndex)!.get(uvIndex)!.set(normalIndex, index);
      index++;
    } else {
      // Re-use indexed point
      indices[i] = pointIndex;
    }
  }

  return meshInit(indexedVertices, indexedUVs, indexedNormals, indices);
}
