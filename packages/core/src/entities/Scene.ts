import { Camera } from './camera/Camera';
import { Mesh } from './mesh/Mesh';

export class Scene {
  public readonly meshes: Array<Mesh> = new Array();
  public readonly cameras: Array<Camera> = new Array();

  constructor() {}
}