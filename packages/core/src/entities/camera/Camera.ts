import { Mat4, mat4Identity, mat4Multiply, mat4RotationQuat, mat4Translation, Vec3, Vec4 } from '../../utils/math';

export class Camera {
  public get translation(): Vec3 {
    return this.translation ?? [0, 0, 0];
  }

  public set translation(value: Vec3) {
    this.translation = value;
    this.calculateMatrix();
  }

  public get rotation(): Vec4 {
    return this.rotation ?? [0, 0, 0, 1];
  }

  public set rotation(value: Vec4) {
    this.rotation = value;
    this.calculateMatrix();
  }

  public get matrix(): Mat4 {
    return this._matrix;
  }

  private _matrix: Mat4 = mat4Identity();

  constructor(public readonly projection: Mat4) {}

  private calculateMatrix(): void {
    this._matrix = mat4Multiply(
      mat4Translation(this.translation),
      mat4RotationQuat(this.rotation)
    );
  }
}
