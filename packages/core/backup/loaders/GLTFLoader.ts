import { TextureSampler } from "../entities/TextureSampler";
import { Material } from "../main";
import { Loader } from "./Loader";

export class GLTFLoader extends Loader {
  /**
   * const response = await fetch('test.png');
   * createImageBitmap(await response.blob());
   */

  public static async loadScene(uri: string, name: string): Scene {

  }

  public static async loadNode(uri: string, name: string): Node {

  }

  public static async loadCamera(uri: string, name: string): Camera {
   
  }

  public static async loadMesh(uri: string, name: string): Mesh {
   
  }

  public static async loadMaterial(uri: string, name: string): Material {
   
  }

  public static async loadTexture(uri: string, name: string): Texture {
   
  }
}