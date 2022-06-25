import { Material } from '../../core/entities/material';
import { mtlParse } from '../../core/utils/material/mtl';
import { RefCounter } from '../types';
import { resolvePath } from '../utils/resolve-path';

export interface MaterialRef {
  readonly path: string;
  readonly material: Material;
}

const EXTENSION_MTL = 'mtl';

const materialCache: Map<string, RefCounter<MaterialRef>> = new Map();

export async function materialFetch(path: string): Promise<MaterialRef> {
  path = resolvePath(path);

  const refCounter = materialCache.get(path);

  if (refCounter) {
    refCounter.refs++;
    return refCounter.resource;
  }

  const extension = path.split('.').pop();

  if (extension?.toLowerCase() !== EXTENSION_MTL) {
    throw new Error(`Unsupported material format: ${extension}`);
  }

  const response = await fetch(path);
  const material = mtlParse(await response.text());
  // Cache and return asset
  const materialRef = { path, material };

  materialCache.set(path, { refs: 1, resource: materialRef });

  return materialRef;
}

export function materialDestroy(materialRef: MaterialRef): void {
  const { path } = materialRef;
  const refCounter = materialCache.get(path);

  if (!refCounter) {
    console.warn(`Material could not be destroyed. Not defined: ${path}`);
    return;
  }

  if (refCounter.refs === 1) {
    materialCache.delete(path);
  } else {
    refCounter.refs--;
  }
}
