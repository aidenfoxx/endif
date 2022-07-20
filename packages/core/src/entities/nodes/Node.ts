import { Mat4, mat4Identity, mat4Multiply, mat4RotationQuat, mat4Scale, mat4Translation, Vec3, Vec4 } from "../../utils/math";

export class Node {
  public readonly children: Array<Node> = new Array();

  public get translation(): Vec3 {
    return this._translation;
  }

  public set translation(value: Vec3) {
    this._translation = value;
    this._matrix = this.calculateMatrix();
  }

  public get rotation(): Vec4 {
    return this._rotation;
  }

  public set rotation(value: Vec4) {
    this._rotation = value;
    this._matrix = this.calculateMatrix();
  }

  public get scale(): Vec3 {
    return this._scale;
  }

  public set scale(value: Vec3) {
    this._scale = value;
    this._matrix = this.calculateMatrix();
  }

  public get matrix(): Mat4 {
    return this._matrix;
  }

  private _translation: Vec3 = [0, 0, 0];
  private _rotation: Vec4 = [0, 0, 0, 1];
  private _scale: Vec3 = [1, 1, 1];
  private _matrix: Mat4 = mat4Identity();

  constructor(public readonly name?: string) {}

  private calculateMatrix(): Mat4 {
    return mat4Multiply(
      mat4Multiply(
        mat4Translation(this._translation),
        mat4RotationQuat(this._rotation)
      ),
      mat4Scale(this._scale)
    );
  }
}
