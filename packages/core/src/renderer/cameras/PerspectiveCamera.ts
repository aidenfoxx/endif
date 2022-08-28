import {
  Mat4,
  mat4Empty,
  mat4Perspective,
  Vec3,
  Vec4
} from '../../utils/math';
import { Camera } from './Camera';

export class PerspectiveCamera extends Camera {
  private projection: Mat4 = mat4Empty();
  private projectionStateID: number = -1;

  constructor(
    public fov: number,
    public aspectRatio: number,
    public nearClip: number = 0.1,
    public farClip: number = 1000,
    public translation: Vec3 = [0, 0, 0],
    public rotation: Vec4 = [0, 0, 0, 1]
  ) {
    super(translation, rotation);
  }

  public getProjection(): Mat4 {
    if (this.stateID !== this.projectionStateID) {
      this.projection = mat4Perspective(this.fov, this.aspectRatio, this.nearClip, this.farClip);
      this.projectionStateID = this.stateID;
    }

    return this.projection;
  }
}
