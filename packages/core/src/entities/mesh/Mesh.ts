import { Mat4, mat4Identity, mat4Multiply, mat4RotationQuat, mat4Scale, mat4Translation, Vec3, Vec4 } from '../../utils/math';
import { MeshPrimitive } from './MeshPrimitive';

export class Mesh {
  public readonly primitives: Array<MeshPrimitive> = new Array();

  public get translation(): Vec3 { // TODO: It might be worth going to explicit functions. Variables are nice, but have limitations
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

  public get scale(): Vec3 {
    return this.scale ?? [1, 1, 1];
  }

  public set scale(value: Vec3) {
    this.scale = value;
    this.calculateMatrix();
  }

  public get matrix(): Mat4 {
    return this._matrix;
  }

  private _matrix: Mat4 = mat4Identity();

  private calculateMatrix(): void {
    this._matrix = mat4Multiply(
      mat4Multiply(
        mat4Translation(this.translation),
        mat4RotationQuat(this.rotation)
      ),
      mat4Scale(this.scale)
    );
  }
}