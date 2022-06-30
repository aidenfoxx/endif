import { Vec3, vec3Normalize, Vec4 } from './vector';

export function quatRotationX(angle: number): Vec4 {
  return quatRotationAxis([1, 0, 0], angle);
}

export function quatRotationY(angle: number): Vec4 {
  return quatRotationAxis([0, 1, 0], angle);
}

export function quatRotationZ(angle: number): Vec4 {
  return quatRotationAxis([0, 0, 1], angle);
}

export function quatRotationAxis(axis: Vec3, angle: number): Vec4 {
  const normalized = vec3Normalize(axis);
  const sin = Math.sin(angle / 2);
  const cos = Math.cos(angle / 2);

  return [normalized[0] * sin, normalized[1] * sin, normalized[2] * sin, cos];
}

// Reference: https://www.euclideanspace.com/maths/geometry/rotations/conversions/eulerToQuaternion/index.htm
export function eulerToQuat(euler: Vec3): Vec4 {
  const cosX = Math.cos(euler[0] * 0.5);
  const cosY = Math.cos(euler[1] * 0.5);
  const cosZ = Math.cos(euler[2] * 0.5);

  const sinX = Math.sin(euler[0] * 0.5);
  const sinY = Math.sin(euler[1] * 0.5);
  const sinZ = Math.sin(euler[2] * 0.5);

  return [
    sinZ * sinY * cosX + cosZ * cosY * sinX,
    cosZ * sinY * cosX - sinZ * cosY * sinX,
    sinZ * cosY * cosX + cosZ * sinY * sinX,
    cosZ * cosY * cosX - sinZ * sinY * sinX,
  ];
}

export function degreesToRadians(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

export function radiansToDegrees(radians: number): number {
  return (radians * 180) / Math.PI;
}
