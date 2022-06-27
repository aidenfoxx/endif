// TODO: Should be immutable
export interface RefCounter<Asset> {
  refs: number;
  resource: Asset;
}
