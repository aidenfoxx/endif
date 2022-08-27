import { Observable } from '../reactor/Observable';
import { Mesh } from './meshes/Mesh';

export class Scene extends Observable {
  public readonly meshes: Map<PropertyKey, Mesh> = new Map();

  public getMesh(key: PropertyKey): Mesh | undefined {
    return this.meshes.get(key);
  }

  public setMesh(key: PropertyKey, mesh: Mesh): void {
    this.meshes.set(key, mesh);
    this.watch(mesh, 'stateID');
  }

  public removeMesh(key: PropertyKey): void {
    const mesh = this.meshes.get(key);

    if (mesh) {
      this.meshes.delete(key);
      this.unwatch(mesh, 'stateID');
    }
  }

  public values(): IterableIterator<Mesh> {
    return this.meshes.values();
  }
}
