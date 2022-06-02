import { 
  Vec3,
  Mat4,
  mat4Multiply,
  mat4RotationEuler,
  mat4Translation
 } from '../utils/math';

interface Camera {
  readonly position: Vec3;
  readonly rotation: Vec3;
  readonly projection: Mat4;
  readonly view: Mat4;
}

export function initCamera(camera: Camera): Camera;
export function initCamera(position: Vec3, rotation: Vec3, projection: Mat4): Camera;
export function initCamera(position: Camera | Vec3, rotation?: Vec3, projection?: Mat4): Camera {
  if (position instanceof Array) {
    return {
      position,
      rotation: rotation!,
      projection: projection!,
      view: mat4Multiply(
        mat4Translation(position),
        mat4RotationEuler(rotation!)
      )
    };
  } else {
    return {
      position: [...position.position],
      rotation: [...position.rotation],
      projection: [...position.projection],
      view: [...position.view]
    };
  }
}

export default Camera;
