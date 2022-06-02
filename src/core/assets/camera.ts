import { 
  Vec3,
  Mat4,
  mat4Multiply,
  mat4RotationEuler,
  mat4Translation,
  vec3Add
 } from '../utils/math';

interface Camera {
  readonly position: Vec3;
  readonly rotation: Vec3;
  readonly projection: Mat4;
  readonly view: Mat4;
}

function generateViewMatrix(position: Vec3, rotation: Vec3) {
  return mat4Multiply(
    mat4Translation(position),
    mat4RotationEuler(rotation)
  );
};

export function cameraInit(camera: Camera): Camera;
export function cameraInit(position: Vec3, rotation: Vec3, projection: Mat4): Camera;
export function cameraInit(position: Camera | Vec3, rotation?: Vec3, projection?: Mat4): Camera {
  if (position instanceof Array) {
    return {
      position,
      rotation: rotation!,
      projection: projection!,
      view: generateViewMatrix(position, rotation!)
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

export function cameraTranslate(camera: Camera, translation: Vec3) {
  const nextPosition = vec3Add(camera.position, translation);
  return {
    position: nextPosition,
    rotation: camera.rotation,
    projection: camera.projection,
    view: generateViewMatrix(camera.position, nextPosition)
  }
}

export function cameraRotate(camera: Camera, rotation: Vec3) {
  const nextRotation = vec3Add(camera.rotation, rotation);
  return {
    position: camera.position,
    rotation: nextRotation,
    projection: camera.projection,
    view: generateViewMatrix(camera.position, nextRotation)
  }
}

export default Camera;
