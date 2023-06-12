import { Observable } from '../reactor/Observable';
import { Mesh } from './meshes/Mesh';

export class Scene extends Observable {
  public readonly meshes: Map<PropertyKey, Mesh> = new Map();
}
