import { Material } from './entities/material';
import { Mesh } from './entities/mesh';
import { Shader } from './entities/shader';
import { Texture } from './entities/texture';
import { parseDDS, parseMTL, parseOBJ } from './utils/parser';

(function (
  meshCache: Map<string, WeakRef<Mesh>>,
  materialCache: Map<string, WeakRef<Material>>,
  textureCache: Map<string, WeakRef<Texture>>,
  shaderCache: Map<string, WeakRef<Shader>>
) {
  async function fetchOBJ(path: string): Promise<Mesh> {
    const cachedMesh = meshCache.get(path)?.deref();

    if (cachedMesh) {
      return cachedMesh;
    }

    const response = await fetch(path);
    const mesh = parseOBJ(await response.text());

    meshCache.set(path, new WeakRef(mesh));

    return mesh;
  }

  async function fetchMTL(path: string): Promise<Material> {
    const cachedMaterial = materialCache.get(path)?.deref();

    if (cachedMaterial) {
      return cachedMaterial;
    }

    const response = await fetch(path);
    const material = parseMTL(await response.text());

    materialCache.set(path, new WeakRef(material));

    return material;
  }

  async function fetchDDS(path: string): Promise<Texture> {
    const cachedTexture = textureCache.get(path)?.deref();

    if (cachedTexture) {
      return cachedTexture;
    }

    const response = await fetch(path);
    const texture = parseDDS(await response.arrayBuffer());

    textureCache.set(path, new WeakRef(texture));

    return texture;
  }

  async function fetchTGA(path: string): Promise<Texture> {
    const cachedTexture = textureCache.get(path)?.deref();

    if (cachedTexture) {
      return cachedTexture;
    }

    const response = await fetch(path);
    const texture = parseDDS(await response.arrayBuffer());

    textureCache.set(path, new WeakRef(texture));

    return texture;
  }

  async function fetchShader(vertexPath: string, fragmentPath: string): Promise<Shader> {
    const cachedShader = shaderCache.get(`${vertexPath}:${fragmentPath}`)?.deref();

    if (cachedShader) {
      return cachedShader;
    }

    const [vertexResponse, fragmentResponse] = await Promise.all([
      fetch(vertexPath),
      fetch(fragmentPath)
    ]);
    const shader = new Shader(await vertexResponse.text(), await fragmentResponse.text());

    shaderCache.set(`${vertexPath}:${fragmentPath}`, new WeakRef(shader));

    return shader;
  }

  // TODO: resolvePath
  addEventListener('message', async function (event) {
    if (!event.source) {
      return;
    }

    try {
      switch (event.data.type) {
        case 'obj':
          event.source.postMessage([await fetchOBJ(event.data.path), null]);
          break;

        case 'mtl':
          event.source.postMessage([await fetchMTL(event.data.path), null]);
          break;

        case 'dds':
          event.source.postMessage([await fetchDDS(event.data.path), null]);
          break;

        case 'tga':
          event.source.postMessage([await fetchTGA(event.data.path), null]);
          break;

        case 'shader':
          event.source.postMessage([
            await fetchShader(event.data.vertexPath, event.data.fragmentPath),
            null
          ]);
          break;
      }
    } catch (e) {
      event.source.postMessage([null, e]);
    }
  });
})(new Map(), new Map(), new Map(), new Map());
