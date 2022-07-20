import { Camera } from './cameras/Camera';
import { CameraNode } from './nodes/CameraNode';
import { MeshNode } from './nodes/MeshNode';
import { Node } from './nodes/Node';

export class Scene {
  public readonly nodes: Array<Node> = new Array();

  constructor(public activeCamera?: Camera) {}

  public getCameraNode(name: string): CameraNode | undefined {
    // TODO: Implement
    return undefined;
  }

  public getMeshNode(name: string): MeshNode | undefined {
    // TODO: Implement
    return undefined;
  }
}