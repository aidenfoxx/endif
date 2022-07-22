import { generateID } from '../utils/generateID';
import { AABB, aabbTransform, Mat4, mat4Identity, mat4Multiply, mat4RotationQuat, mat4Scale, mat4Translation, Vec3, vec3Max, vec3Min, Vec4 } from '../utils/math';
import { MeshPrimitive } from './MeshPrimitive';

export class Mesh {
  private readonly primitives: Set<MeshPrimitive> = new Set();

  private translation: Vec3 = [0, 0, 0];
  private rotation: Vec4 = [0, 0, 0, 1];
  private scale: Vec3 = [1, 1, 1];
  private matrix: Mat4 = mat4Identity();

  private obb: AABB = [[0, 0, 0], [0, 0, 0,]];
  private aabb: AABB = [[0, 0, 0], [0, 0, 0,]];

  private cacheKey: number = generateID();

  public getTranslation(): Vec3 {
    return this.translation;
  }

  public getRotation(): Vec4 {
    return this.rotation;
  }

  public getScale(): Vec3 {
    return this.scale;
  }

  public getMatrix(): Mat4 {
    return this.matrix;
  }

  public getOBB(): AABB {
    return this.obb;
  }

  public getAABB(): AABB {
    return this.aabb;
  }

  public getCacheKey(): number {
    return this.cacheKey;
  }

  public setTranslation(translation: Vec3): void {
    this.translation = translation;
    this.calculateMatrix();
  }

  public setRotation(rotation: Vec4): void {
    this.rotation = rotation;
    this.calculateMatrix();
  }

  public setScale(scale: Vec3): void {
    this.scale = scale;
    this.calculateMatrix();
  }

  public addPrimitive(primitive: MeshPrimitive): void {
    const primitiveOBB = primitive.getOBB();

    this.primitives.add(primitive);
    this.obb = [
      vec3Min(this.obb[0], primitiveOBB[0]),
      vec3Max(this.obb[1], primitiveOBB[1])
    ];
    this.calculateAABB();
  }

  private calculateMatrix(): void {
    this.matrix = mat4Multiply(
      mat4Multiply(
        mat4Translation(this.translation),
        mat4RotationQuat(this.rotation)
      ),
      mat4Scale(this.scale)
    );
    this.calculateAABB();
  }

  private calculateAABB(): void {
    this.aabb = aabbTransform(this.obb, this.matrix);
    this.cacheKey = generateID();
  }
}