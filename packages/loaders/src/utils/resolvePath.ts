export function resolvePath(path: string): string {
  return new URL(path, self.location.href).pathname;
}
