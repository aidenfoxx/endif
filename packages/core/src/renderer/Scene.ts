import { Camera } from './cameras/Camera';
import { Mesh } from './meshes/Mesh';

export class Scene {
  public readonly meshes: Map<PropertyKey, Mesh> = new Map();
  public readonly cameras: Map<PropertyKey, Camera> = new Map();

  constructor() {}
}
