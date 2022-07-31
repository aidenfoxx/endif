import { Observable } from '../../reactor/Observable';
import {
  AABB,
  Mat4,
  mat4Identity,
  mat4Multiply,
  mat4RotationQuat,
  mat4Translation,
  Vec3,
  vec3Inverse,
  Vec4,
  vec4Normalize,
} from '../../utils/math';

type ViewFrustum = [Vec4, Vec4, Vec4, Vec4, Vec4, Vec4];

export abstract class Camera extends Observable {
  public frustumCulling: boolean = true;

  private matrix: Mat4 = mat4Identity();
  private matrixStateID: number = -1;

  private viewFrustum: ViewFrustum = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ];
  private viewFrustumStateID: number = -1;

  constructor(public translation: Vec3 = [0, 0, 0], public rotation: Vec4 = [0, 0, 0, 1]) {
    super();

    this.watch(this, 'translation');
    this.watch(this, 'rotation');
  }

  public getMatrix(): Mat4 {
    if (this.stateID !== this.matrixStateID) {
      this.matrix = mat4Multiply(
        mat4Translation(vec3Inverse(this.translation)),
        mat4RotationQuat(this.rotation)
      );
      this.matrixStateID = this.stateID;
    }

    return this.matrix;
  }

  public abstract getProjection(): Mat4;

  public isVisible(aabb: AABB): boolean {
    if (this.stateID !== this.viewFrustumStateID) {
      const mat = mat4Multiply(this.getProjection(), this.getMatrix());

      this.viewFrustum = [
        vec4Normalize([mat[3] + mat[0], mat[7] + mat[4], mat[11] + mat[8], mat[15] + mat[12]]),
        vec4Normalize([mat[3] - mat[0], mat[7] - mat[4], mat[11] - mat[8], mat[15] - mat[12]]),
        vec4Normalize([mat[3] + mat[1], mat[7] + mat[5], mat[11] + mat[9], mat[15] + mat[13]]),
        vec4Normalize([mat[3] - mat[1], mat[7] - mat[5], mat[11] - mat[9], mat[15] - mat[13]]),
        vec4Normalize([mat[3] + mat[2], mat[7] + mat[6], mat[11] + mat[10], mat[15] + mat[14]]),
        vec4Normalize([mat[3] - mat[2], mat[7] - mat[6], mat[11] - mat[10], mat[15] - mat[14]]),
      ];
      this.viewFrustumStateID = this.stateID;
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
}
