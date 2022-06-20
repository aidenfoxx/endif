export function resolvePath(path: string): string {
  return new URL(path, window.location.href).pathname;
}
