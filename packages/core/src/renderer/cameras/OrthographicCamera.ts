import { Mat4, mat4Empty, mat4Orthographic, Vec3, Vec4 } from '../../utils/math';
import { Camera } from './Camera';

export class OrthographicCamera extends Camera {
  private projection: Mat4 = mat4Empty();

  constructor(
    public readonly left: number,
    public readonly right: number,
    public readonly top: number,
    public readonly bottom: number,
    public readonly nearClip: number,
    public readonly farClip: number,
    translation: Vec3 = [0, 0, 0],
    rotation: Vec4 = [0, 0, 0, 1]
  ) {
    super(translation, rotation);

    this.projection = mat4Orthographic(
      this.left,
      this.right,
      this.top,
      this.bottom,
      this.nearClip,
      this.farClip
    );
  }

  public getProjection(): Mat4 {
    return this.projection;
  }
}
