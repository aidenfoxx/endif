import Mesh, { initMesh } from '../assets/mesh';
import { Vec3, Vec2 } from '../utils/math';
import { ObjParseException } from '../expcetions';

const VERTEX_MATCH = /^v (-?\d+\.?\d*) (-?\d+\.?\d*) (-?\d+\.?\d*)$/;
const UV_MATCH = /^vt (-?\d+\.?\d*) (-?\d+\.?\d*)$/;
const NORMAL_MATCH = /^vn (-?\d+\.?\d*) (-?\d+\.?\d*) (-?\d+\.?\d*)$/;
const FACE_MATCH = /^f (\d+)\/?(\d*)\/?(\d*) (\d+)\/?(\d*)\/?(\d*) (\d+)\/?(\d*)\/?(\d*)$/;

export function parseObj(data: string): Mesh {
  const lines = data.split(/\r\n|\n/g);
  
  const vertices: Vec3[] = [];
  const uvs: Vec2[] = [];
  const normals: Vec3[] = [];
  const points: Vec3[] = [];

  // Parse obj data
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (line[0] === 'v') {
      if (line[1] === ' ') {
        const match = line.match(VERTEX_MATCH);

        if (match) {
          vertices.push([Number(match[1]), Number(match[2]), Number(match[3])]);
        }
      } else if (line[1] === 't' && line[2] === ' ') {
        const match = line.match(UV_MATCH);

        if (match) {
          uvs.push([Number(match[1]), Number(match[2])]);
        }
      } else if (line[1] === 'n' && line[2] === ' ') {
        const match = line.match(NORMAL_MATCH);

        if (match) {
          normals.push([Number(match[1]), Number(match[2]), Number(match[3])]);
        }
      }
    } else if (line[0] === 'f' && line[1] === ' ') {
      const match = line.match(FACE_MATCH);

      if (match) {
        points.push([Number(match[1]), Number(match[2]), Number(match[3])]);
        points.push([Number(match[4]), Number(match[5]), Number(match[6])]);
        points.push([Number(match[7]), Number(match[8]), Number(match[9])]);
      }
    }
  }

  if (!points.length) {
    throw new ObjParseException('Invalid format');
  }

  // Index mesh
  const indexedVertices: number[] = [];
  const indexedUVs: number[] = []
  const indexedNormals: number[] = [];
  const indices: number[] = [];

  const indexCache: Record<any, Record<any, Record<any, number>>> = {};

  const setIndexedValue = (dest: number[], source: Vec3 | Vec2, index: number) => {
    const offset = index * source.length;

    for (let i = 0; i < source.length; i++) {
      dest[offset + i] = source[i];
    }
  };

  for (let i = 0, index = 0; i < points.length; i++) {
    const point = points[i];
    // Returns -1 if index does not exist
    const vertexIndex = point[0] < 0 ? vertices.length + point[0] : point[0] - 1;
    const uvIndex = point[1] < 0 ? uvs.length + point[1] : point[1] - 1;
    const normalIndex = point[2] < 0 ? normals.length + point[2] : point[2] - 1;
    
    if (!indexCache[vertexIndex]?.[uvIndex]?.[normalIndex]) {
      if (vertices[vertexIndex] === undefined) {
        throw new ObjParseException(`Vertex index out-of-bounds`);
      }

      setIndexedValue(indexedVertices, vertices[vertexIndex], index);
      
      if (point[1]) {
        if (uvs[uvIndex] === undefined) {
          throw new ObjParseException('UV index out-of-bounds');
        }

        setIndexedValue(indexedUVs, uvs[vertexIndex], index);
      }

      if (point[2]) {
        if (normals[normalIndex] === undefined) {
          throw new ObjParseException('Normal index out-of-bounds');
        }

        setIndexedValue(indexedNormals, normals[vertexIndex], index);
      }

      if (!indexCache[vertexIndex]) {
      	indexCache[vertexIndex] = {};
      }
      
      if (!indexCache[vertexIndex][uvIndex]) {
      	indexCache[vertexIndex][uvIndex] = {};
      }

      indices[i] = index;
      indexCache[vertexIndex][uvIndex][normalIndex] = index;
      index++;
    } else {
      indices[i] = indexCache[vertexIndex][uvIndex][normalIndex];
    }
  }

  return initMesh(indexedVertices, indexedUVs, indexedNormals, indices);
}
