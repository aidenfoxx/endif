import { Mat4, mat4Empty, mat4Orthographic, Vec3, Vec4 } from '../../utils/math';
import { Camera } from './Camera';

export class OrthographicCamera extends Camera {
  private projection: Mat4 = mat4Empty();
  private projectionStateID: number = -1;

  constructor(
    public readonly left: number,
    public readonly right: number,
    public readonly top: number,
    public readonly bottom: number,
    public readonly nearClip: number,
    public readonly farClip: number,
    public readonly translation: Vec3 = [0, 0, 0],
    public readonly rotation: Vec4 = [0, 0, 0, 1]
  ) {
    super(translation, rotation);
  }

  public getProjection(): Mat4 {
    if (this.stateID !== this.projectionStateID) {
      this.projection = mat4Orthographic(
        this.left,
        this.right,
        this.top,
        this.bottom,
        this.nearClip,
        this.farClip
      );
      this.projectionStateID = this.stateID;
    }

    return this.projection;
  }
}
