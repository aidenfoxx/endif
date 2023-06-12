import { resolvePath } from '../utils/resolvePath';

export abstract class Loader {
  private static fetchCache: Map<string, WeakRef<Promise<Response>>> = new Map();

  protected static async fetch(uri: string, options?: RequestInit): Promise<Response> {
    uri = resolvePath(uri);

    // Prevent triggering multiple requests for the same resource
    let response = this.fetchCache.get(uri)?.deref();

    if (response) {
      return response;
    }

    response = fetch(uri, { cache: 'force-cache', ...options });

    // Use a WeakRef to allow GC, with future requests fetched from cache
    this.fetchCache.set(uri, new WeakRef(response));

    return response;
  }
}
