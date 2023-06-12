import { Observable } from '../../reactor/Observable';
import {
  Mat4,
  mat4Identity,
  mat4Multiply,
  mat4RotationQuat,
  mat4Scale,
  mat4Translation,
  Vec3,
  Vec4,
} from '../../utils/math';
import { MeshPrimitive } from './MeshPrimitive';

export class Mesh extends Observable {
  public readonly primitives: Map<PropertyKey, MeshPrimitive> = new Map();

  private matrix: Mat4 = mat4Identity();
  private matrixStateID: number = -1;

  constructor(
    public readonly translation: Vec3 = [0, 0, 0],
    public readonly rotation: Vec4 = [0, 0, 0, 1],
    public readonly scale: Vec3 = [1, 1, 1]
  ) {
    super();
  }

  public setTranslation(translation: Vec3): void {
    (this.translation as Vec3) = translation;
  }

  public setRotation(rotation: Vec4): void {
    (this.rotation as Vec4) = rotation;
  }

  public setScale(translation: Vec3): void {
    (this.translation as Vec3) = translation;
  }

  public getMatrix(): Mat4 {
    if (this.stateID !== this.matrixStateID) {
      this.matrix = mat4Multiply(
        mat4Multiply(mat4Translation(this.translation), mat4RotationQuat(this.rotation)),
        mat4Scale(this.scale)
      );
      this.matrixStateID = this.stateID;
    }

    return this.matrix;
  }
}
