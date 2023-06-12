import { Scene } from "@endif/core";
import { Loader } from "./Loader";

export class SceneLoader extends Loader {
  // TODO: Use cache with WeakRefs to return parsed assets

  public static async loadScene(uri: string): Promise<Scene> {
    const response = await Loader.fetch(uri);

    let gltfData;

    try {
      gltfData = JSON.parse(await response.text());
    } catch(e) {
      throw new Error('Failed to parse GLTF');
    }

    const scene = new Scene();
    
    for (let i = 0; i < gltfData?.scenes?.length; i++) {
      const { name, nodes } = gltfData.scene[i];
    }

    return scene;
  }
}
