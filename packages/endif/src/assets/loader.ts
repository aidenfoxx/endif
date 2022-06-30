import { Material } from '../entities/material';
import { Mesh } from '../entities/mesh';
import { Texture } from '../entities/texture';
import { shaderCreate } from '../utils/gl/shader';
import { tboCreate } from '../utils/gl/tbo';
import { vaoCreate } from '../utils/gl/vao';
import { parseDDS, parseMTL, parseOBJ, parseTGA } from '../utils/parser';
import { resolvePath } from '../utils/resolvePath';

export enum Extensions {
  DDS = 'dds',
  FNT = 'fnt',
  MTL = 'mtl',
  OBJ = 'obj',
  TGA = 'tga',
}

interface RefCounter<AssetRef> {
  refs: number;
  readonly asset: AssetRef;
}

export interface MeshRef {
  readonly path: string;
  readonly mesh: Mesh;
  readonly vao: WebGLVertexArrayObject;
}

export interface TextureRef {
  readonly path: string;
  readonly texture: Texture;
  readonly tbo: WebGLTexture;
}

export interface MaterialRef {
  readonly path: string;
  readonly material: Material;
}

export interface ShaderRef {
  readonly vertexPath: string;
  readonly fragmentPath: string;
  readonly program: WebGLProgram;
}

const meshCache: Map<string, RefCounter<MeshRef>> = new Map();
const textureCache: Map<string, RefCounter<TextureRef>> = new Map();
const materialCache: Map<string, RefCounter<MaterialRef>> = new Map();
const shaderCache: Map<string, Map<string, RefCounter<ShaderRef>>> = new Map();

export async function meshLoad(gl: WebGL2RenderingContext, path: string): Promise<MeshRef> {
  path = resolvePath(path);

  const refCounter = meshCache.get(path);

  // Return from cache
  if (refCounter) {
    refCounter.refs++;
    return refCounter.asset;
  }

  const extension = path.split('.').pop()?.toLowerCase();

  if (extension !== Extensions.OBJ) {
    throw new Error(`Unsupported mesh format: ${extension}`);
  }

  const response = await fetch(path);
  const mesh = parseOBJ(await response.text());
  const vao = vaoCreate(gl, mesh);

  // Cache and return
  const meshRef = {
    path,
    mesh,
    vao,
  };

  meshCache.set(path, {
    refs: 1,
    asset: meshRef,
  });

  return meshRef;
}

export function meshDestroy(gl: WebGL2RenderingContext, meshRef: MeshRef): void {
  const path = meshRef.path;
  const refCounter = meshCache.get(path);

  if (!refCounter) {
    console.warn('Mesh could not be destroyed. Not defined');
    return;
  }

  if (refCounter.refs === 1) {
    gl.deleteVertexArray(refCounter.asset.vao);
    meshCache.delete(path);
  } else {
    refCounter.refs--;
  }
}

export async function textureLoad(gl: WebGL2RenderingContext, path: string): Promise<TextureRef> {
  path = resolvePath(path);

  const refCounter = textureCache.get(path);

  // Return from cache
  if (refCounter) {
    refCounter.refs++;
    return refCounter.asset;
  }

  const extension = path.split('.').pop()?.toLowerCase();

  if (extension !== Extensions.DDS && extension !== Extensions.TGA) {
    throw new Error(`Unsupported texture format: ${extension}`);
  }

  const response = await fetch(path);
  const texture =
    extension === Extensions.DDS
      ? parseDDS(await response.arrayBuffer())
      : parseTGA(await response.arrayBuffer());
  const tbo = tboCreate(gl, texture);

  // Cache and return
  const textureRef = {
    path,
    texture,
    tbo,
  };

  textureCache.set(path, {
    refs: 1,
    asset: textureRef,
  });

  return textureRef;
}

export function textureDestroy(gl: WebGL2RenderingContext, textureRef: TextureRef): void {
  const path = textureRef.path;
  const refCounter = textureCache.get(path);

  if (!refCounter) {
    console.warn('Texture could not be destroyed. Not defined');
    return;
  }

  if (refCounter.refs === 1) {
    gl.deleteTexture(refCounter.asset.tbo);
    textureCache.delete(path);
  } else {
    refCounter.refs--;
  }
}

export async function materialLoad(path: string): Promise<MaterialRef> {
  path = resolvePath(path);

  const refCounter = materialCache.get(path);

  // Return from cache
  if (refCounter) {
    refCounter.refs++;
    return refCounter.asset;
  }

  const extension = path.split('.').pop()?.toLowerCase();

  if (extension !== Extensions.MTL) {
    throw new Error(`Unsupported material format: ${extension}`);
  }

  const response = await fetch(path);
  const material = parseMTL(await response.text());

  // Cache and return
  const materialRef = { path, material };

  materialCache.set(path, { refs: 1, asset: materialRef });

  return materialRef;
}

export function materialDestroy(materialRef: MaterialRef): void {
  const { path } = materialRef;
  const refCounter = materialCache.get(path);

  if (!refCounter) {
    console.warn('Material could not be destroyed. Not defined');
    return;
  }

  if (refCounter.refs === 1) {
    materialCache.delete(path);
  } else {
    refCounter.refs--;
  }
}

export async function shaderLoad(
  gl: WebGL2RenderingContext,
  vertexPath: string,
  fragmentPath: string
): Promise<ShaderRef> {
  vertexPath = resolvePath(vertexPath);
  fragmentPath = resolvePath(fragmentPath);

  const refCounter = shaderCache.get(vertexPath)?.get(fragmentPath);

  // Return from cache
  if (refCounter) {
    shaderCache.get(vertexPath)!.set(fragmentPath, { ...refCounter, refs: refCounter.refs + 1 });
    return refCounter.asset;
  }

  const [vertexSource, fragmentSource] = await Promise.all([
    fetch(vertexPath).then((response) => response.text()),
    fetch(fragmentPath).then((response) => response.text()),
  ]);
  const program = shaderCreate(gl, vertexSource, fragmentSource);

  // Cache and return
  const shaderRef = {
    vertexPath,
    fragmentPath,
    program,
  };

  if (!shaderCache.get(vertexPath)) {
    shaderCache.set(vertexPath, new Map());
  }

  shaderCache.get(vertexPath)!.set(fragmentPath, {
    refs: 1,
    asset: shaderRef,
  });

  return shaderRef;
}

export function shaderDestroy(gl: WebGL2RenderingContext, shaderRef: ShaderRef): void {
  const { vertexPath, fragmentPath } = shaderRef;
  const refCounter = shaderCache.get(vertexPath)?.get(fragmentPath);

  if (!refCounter) {
    console.warn('Shader could not be destroyed. Not defined');
    return;
  }

  if (refCounter.refs === 1) {
    gl.deleteProgram(refCounter.asset.program);
    shaderCache.get(vertexPath)!.delete(fragmentPath);
  } else {
    refCounter.refs--;
  }
}
