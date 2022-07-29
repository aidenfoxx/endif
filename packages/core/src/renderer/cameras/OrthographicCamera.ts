import { Mat4, mat4Empty, mat4Orthographic, Vec3, Vec4 } from '../../utils/math';
import { Camera } from './Camera';

export class OrthographicCamera extends Camera {
  private projection: Mat4 = mat4Empty();
  private projectionStateID: number = -1;

  constructor(
    public left: number,
    public right: number,
    public top: number,
    public bottom: number,
    public nearClip: number,
    public farClip: number,
    public translation: Vec3 = [0, 0, 0],
    public rotation: Vec4 = [0, 0, 0, 1]
  ) {
    super(translation, rotation);

    this.watch(this, 'left');
    this.watch(this, 'right');
    this.watch(this, 'top');
    this.watch(this, 'bottom');
    this.watch(this, 'nearClip');
    this.watch(this, 'farClip');
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
