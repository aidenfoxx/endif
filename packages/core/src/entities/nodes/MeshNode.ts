import { Mesh } from '../Mesh';
import { Node } from './Node';

export class MeshNode extends Node {
  constructor(public readonly mesh: Mesh, public readonly name?: string) {
    super(name);
  }
}