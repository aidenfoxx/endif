import { TextureBuffer } from './buffer/TextureBuffer';
import { Camera } from './camera/Camera';
import { OrthographicCamera } from './camera/OrthographicCamera';
import { PerspectiveCamera } from './camera/PerspectiveCamera';
import { Material } from './Material';
import { Mesh } from './Mesh';
import { MeshBuffers, MeshPrimitive } from './MeshPrimitive';

export class Scene {
  private readonly meshes: Array<Mesh> = new Array();
  private readonly cameras: Array<Camera> = new Array();

  private gl?: WebGL2RenderingContext;
  private activeCamera?: Camera;
    
  public createMesh(): Mesh {
    const mesh = new Mesh();
    this.meshes.push(mesh);

    return mesh;
  }

  public createPerspectiveCamera(
    fov: number,
    aspectRatio: number,
    nearClip: number,
    farClip: number
  ): Camera {
    const camera = new PerspectiveCamera(fov, aspectRatio, nearClip, farClip);
    this.cameras.push(camera);

    return camera;
  }

  public createOrthographicsCamera(
    left: number,
    right: number,
    top: number,
    bottom: number,
    nearClip: number,
    farClip: number
  ): Camera {
    const camera = new OrthographicCamera(left, right, top, bottom, nearClip, farClip);
    this.cameras.push(camera);

    return camera;
  }

  public getActiveCamera(): Camera | undefined {
    return this.activeCamera;
  }

  public setActiveCamera(camera?: Camera): void {
    if (camera && !this.cameras.indexOf(camera)) {
      throw new Error('Camera does not belong to scene instance');
    }
    this.activeCamera = camera;
  }

  public setContext(gl?: WebGL2RenderingContext): void {
    this.gl = gl;
  }

  public render(): void {
    if (!this.gl) {
      console.warn('Render called without GL context');
      return;
    }
  }
}