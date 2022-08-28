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

  constructor(
    public fov: number,
    public aspectRatio: number,
    public nearClip: number = 0.1,
    public farClip: number = 1000,
    translation: Vec3 = [0, 0, 0],
    rotation: Vec4 = [0, 0, 0, 1]
  ) {
    super(translation, rotation);

    this.projection = mat4Perspective(this.fov, this.aspectRatio, this.nearClip, this.farClip);
  }

  public getProjection(): Mat4 {
    return this.projection;
  }
}
