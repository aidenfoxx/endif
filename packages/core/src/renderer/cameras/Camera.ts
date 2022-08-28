import {
  AABB,
  Mat4,
  mat4Multiply,
  mat4RotationQuat,
  mat4Translation,
  Vec3,
  vec3Inverse,
  Vec4,
  vec4Normalize,
} from '../../utils/math';

type ViewFrustum = [Vec4, Vec4, Vec4, Vec4, Vec4, Vec4];

export abstract class Camera {
  public readonly frustumCulling: boolean = true;

  private matrix?: Mat4;

  private viewFrustum?: ViewFrustum;

  constructor(
    public readonly translation: Vec3 = [0, 0, 0],
    public readonly rotation: Vec4 = [0, 0, 0, 1]
  ) {}

  public setFrustumCulling(frustumCulling: boolean): void {
    (this.frustumCulling as boolean) = frustumCulling;
  }

  public setTranslation(translation: Vec3): void {
    (this.translation as Vec3) = translation;
    this.matrix = undefined;
    this.viewFrustum = undefined;
  }

  public setRotation(rotation: Vec4): void {
    (this.rotation as Vec4) = rotation;
    this.matrix = undefined;
    this.viewFrustum = undefined;
  }

  public getMatrix(): Mat4 {
    if (!this.matrix) {
      this.matrix = mat4Multiply(
        mat4Translation(vec3Inverse(this.translation)),
        mat4RotationQuat(this.rotation)
      );
    }

    return this.matrix;
  }

  public isVisible(aabb: AABB): boolean {
    if (!this.viewFrustum) {
      const mat = mat4Multiply(this.getProjection(), this.getMatrix());

      this.viewFrustum = [
        vec4Normalize([mat[3] + mat[0], mat[7] + mat[4], mat[11] + mat[8], mat[15] + mat[12]]),
        vec4Normalize([mat[3] - mat[0], mat[7] - mat[4], mat[11] - mat[8], mat[15] - mat[12]]),
        vec4Normalize([mat[3] + mat[1], mat[7] + mat[5], mat[11] + mat[9], mat[15] + mat[13]]),
        vec4Normalize([mat[3] - mat[1], mat[7] - mat[5], mat[11] - mat[9], mat[15] - mat[13]]),
        vec4Normalize([mat[3] + mat[2], mat[7] + mat[6], mat[11] + mat[10], mat[15] + mat[14]]),
        vec4Normalize([mat[3] - mat[2], mat[7] - mat[6], mat[11] - mat[10], mat[15] - mat[14]]),
      ];
    }

    for (let i = 0; i < 6; i++) {
      const plane = this.viewFrustum[i];
      const distance =
        Math.max(aabb[0][0] * plane[0], aabb[1][0] * plane[0]) +
        Math.max(aabb[0][1] * plane[1], aabb[1][1] * plane[1]) +
        Math.max(aabb[0][2] * plane[2], aabb[1][2] * plane[2]) +
        plane[3];

      if (distance < 0) {
        return false;
      }
    }

    return true;
  }

  public abstract getProjection(): Mat4;
}
