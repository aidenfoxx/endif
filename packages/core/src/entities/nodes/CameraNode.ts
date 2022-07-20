import { Camera } from '../cameras/Camera';
import { Node } from './Node';

export class CameraNode extends Node {
  constructor(public readonly camera: Camera, public readonly name?: string) {
    super(name);
  }
}