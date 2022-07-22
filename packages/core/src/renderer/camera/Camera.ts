import { Observable } from '../../reactor/Observable';
import {
  AABB,
  Mat4,
  mat4Identity,
  mat4Multiply,
  mat4RotationQuat,
  mat4Translation,
  Vec3,
  Vec4,
} from '../../utils/math';

export abstract class Camera extends Observable {
  public frustumCulling: boolean = true;

  private matrix: Mat4 = mat4Identity();
  private matrixStateID: number = -1;

  constructor(public translation: Vec3 = [0, 0, 0], public rotation: Vec4 = [0, 0, 0, 1]) {
    super();

    this.watch(this, 'frustumCulling');
    this.watch(this, 'translation');
    this.watch(this, 'rotation');
  }

  public getMatrix(): Mat4 {
    if (this.stateID !== this.matrixStateID) {
      this.matrix = mat4Multiply(
        mat4Translation(this.translation),
        mat4RotationQuat(this.rotation)
      );
    }

    return this.matrix;
  }

  public abstract getProjection(): Mat4;

  public abstract isVisible(aabb: AABB): boolean;
}
