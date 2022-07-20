import { resolvePath } from "../utils/resolvePath";

export abstract class Loader {
  private static fetchCache: Map<string, WeakRef<Promise<Response>>> = new Map();

  protected static async fetch(uri: string, options?: RequestInit): Promise<Response> {
    uri = resolvePath(uri);

    // Prevent triggering multiple requests for the same resource
    let response = this.fetchCache.get(uri)?.deref();

    if (response) {
      return response;
    }

    response = fetch(uri, { ...options, cache: 'force-cache' });

    // Use a weak ref to allow GC and fetch from browser cache
    this.fetchCache.set(uri, new WeakRef(response));

    return response;
  }
}