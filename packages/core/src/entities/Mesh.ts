import { AABB, Mat4, mat4Identity, mat4Multiply, mat4RotationQuat, mat4Scale, mat4Translation, Vec3, Vec4 } from '../utils/math';
import { MeshPrimitive } from './MeshPrimitive';

export class Mesh extends Observable {
  public readonly primitives: Map<PropertyKey, MeshPrimitive> = new Map();

  private matrix: Mat4 = mat4Identity();
  private matrixStateID: number = -1;

  constructor(
    public translation: Vec3 = [0, 0, 0],
    public rotation: Vec4 = [0, 0, 0, 1],
    public scale: Vec3 = [1, 1, 1]
  ) {
    super();

    this.watch(this, 'translation');
    this.watch(this, 'rotation');
    this.watch(this, 'scale');
  }

  public getMatrix(): Mat4 {
    if (this.stateID !== this.matrixStateID) {
      this.matrix = mat4Multiply(
        mat4Multiply(
          mat4Translation(this.translation),
          mat4RotationQuat(this.rotation)
        ),
        mat4Scale(this.scale)
      );
      this.matrixStateID = this.stateID;
    }

    return this.matrix;
  }
}