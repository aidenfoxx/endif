import { AABB, Mat4, mat4Empty, mat4Multiply, mat4Perspective, Vec3, Vec4, vec4Normalize } from '../../utils/math';
import { Camera } from './Camera';

type ViewFrustum = [Vec4, Vec4, Vec4, Vec4, Vec4, Vec4];

export class PerspectiveCamera extends Camera {
  private projection: Mat4 = mat4Empty();
  private projectionStateID: number = -1;

  private viewFrustum: ViewFrustum = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0]
  ];
  private viewFrustumStateID: number = -1;

  constructor(
    public fov: number,
    public aspectRatio: number,
    public nearClip: number = .1,
    public farClip: number = 1000,
    public translation: Vec3 = [0, 0, 0],
    public rotation: Vec4 = [0, 0, 0, 1]
  ) {
    super(translation, rotation);

    this.watch(this, 'fov');
    this.watch(this, 'aspectRatio');
    this.watch(this, 'nearClip');
    this.watch(this, 'farClip');
  }

  public getProjection(): Mat4 {
    if (this.stateID !== this.projectionStateID) {
      this.projection = mat4Perspective(this.fov, this.aspectRatio, this.nearClip, this.farClip);
      this.projectionStateID = this.stateID;
    }

    return this.projection;
  }

  public isVisible(aabb: AABB): boolean {
    if (this.stateID !== this.viewFrustumStateID) {
      const mat = mat4Multiply(this.getProjection(), this.getMatrix());
      // TODO: Is normalizing required?
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
      const distance = Math.max(aabb[0][0] * plane[0], aabb[1][0] * plane[0])
        + Math.max(aabb[0][1] * plane[1], aabb[1][1] * plane[1])
        + Math.max(aabb[0][2] * plane[2], aabb[1][2] * plane[2])
        + plane[3];

      if (distance < 0) {
        return false;
      }
    }

    return true;
  }
}
