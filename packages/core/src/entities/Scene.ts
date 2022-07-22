import { Camera } from './camera/Camera';
import { Mesh } from './Mesh';

export class Scene {
  public readonly meshes: Map<PropertyKey, Mesh> = new Map();
  public readonly cameras: Map<PropertyKey, Camera> = new Map();

  constructor() {}
}