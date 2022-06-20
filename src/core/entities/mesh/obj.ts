import { Mesh, meshInit } from '../mesh';
import { Vec3, Vec2 } from '../../utils/math';
import { ObjParseException } from '../../expcetions';

const POINT_MATCH = /^(-?\d+)\/?(-?\d*)\/?(-?\d*)$/;

function indexAttribute(index: number, src: Vec2 | Vec3 | undefined, dest: number[]): void {
  if (src === undefined) {
    throw new ObjParseException(`Attribute index out-of-bounds`);
  }

  const offset = index * src.length;

  for (let i = 0; i < src.length; i++) {
    dest[offset + i] = src[i];
  }
}

export function objParse(data: string): Mesh {
  const lines = data.split(/\r\n|\n/g);

  const vertices: Vec3[] = [];
  const uvs: Vec2[] = [];
  const normals: Vec3[] = [];
  const points: Vec3[] = [];

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
  const indexedUVs = []
  const indexedNormals = [];
  const indices = [];

  const indexCache: Dictionary<any, Dictionary<any, Dictionary<any, number>>> = {};

  for (let i = 0, index = 0; i < points.length; i++) {
    const point = points[i];
    // Returns -1 if index does not exist
    const vertexIndex = point[0] < 0 ? vertices.length + point[0] : point[0] - 1;
    const uvIndex = point[1] < 0 ? uvs.length + point[1] : point[1] - 1;
    const normalIndex = point[2] < 0 ? normals.length + point[2] : point[2] - 1;
    const pointIndex = indexCache[vertexIndex]?.[uvIndex]?.[normalIndex];

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
      if (!indexCache[vertexIndex]) {
        indexCache[vertexIndex] = {};
      }

      // NOTE: Typescript has issues with sub-indexes
      if (!indexCache[vertexIndex]![uvIndex]) {
        indexCache[vertexIndex]![uvIndex] = {};
      }

      indices[i] = index;
      // NOTE: Typescript has issues with sub-indexes
      indexCache[vertexIndex]![uvIndex]![normalIndex] = index;
      index++;
    } else {
      // Re-use indexed point
      indices[i] = pointIndex;
    }
  }

  return meshInit(indexedVertices, indexedUVs, indexedNormals, indices);
}
