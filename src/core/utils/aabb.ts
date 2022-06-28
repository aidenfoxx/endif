import {
  Mat4,
  Vec3,
  vec3Add,
  vec3Multiply,
  vec3MultiplyMat4,
  vec3Subtract,
  vec4MultiplyMat4
} from './math';

export type AABB = [Vec3, Vec3];

export function aabbCalculate(vertices: Array<number>): AABB {
  let minX = 0;
  let minY = 0;
  let minZ = 0;

  let maxX = 0;
  let maxY = 0;
  let maxZ = 0;

  for (let i = 0; i < vertices.length; i += 3) {
    minX = Math.min(minX, vertices[i]);
    minY = Math.min(minY, vertices[i + 1]);
    minZ = Math.min(minZ, vertices[i + 2]);

    maxX = Math.max(maxX, vertices[i]);
    maxY = Math.max(maxY, vertices[i + 1]);
    maxZ = Math.max(maxZ, vertices[i + 2]);
  }

  return [
    [minX, minY, minZ],
    [maxX, maxY, maxZ],
  ];
}

export function aabbTransform(aabb: AABB, transform: Mat4): AABB {
  const center = vec3Multiply(vec3Add(aabb[0], aabb[1]), [0.5, 0.5, 0.5]);
  const extents = vec3Subtract(aabb[1], center);

  const nextCenter = vec4MultiplyMat4([...center, 1.0], transform);
  const nextExtents = vec3MultiplyMat4(extents, transform);

  const min = vec3Subtract([nextCenter[0], nextCenter[1], nextCenter[2]], nextExtents);
  const max = vec3Add([nextCenter[0], nextCenter[1], nextCenter[2]], nextExtents);

  return [min, max];
}
